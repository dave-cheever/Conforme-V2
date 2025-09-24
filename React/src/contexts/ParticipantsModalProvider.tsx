import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { useDisclosure, useToast } from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { IParticipantsModalContext } from '../interfaces/IParticipantsModalContext';
import { IUser } from '../interfaces/IUser';
import { useAppContext } from './AppProvider';

const GET_SELECTED_USERS_FROM_DB = gql`
  query ($userQueryInput: UserQueryInput) {
    usersByIdFromDb(userQueryInput: $userQueryInput) {
      _id
      userId
      displayName
      jobTitle
      email
      imgUrl
    }
  }
`;

const SEARCH_USERS = gql`
  query ($searchQuery: SearchUserQuery) {
    searchUsers(searchQuery: $searchQuery) {
      _id
      userId
      displayName
      jobTitle
      email
      imgUrl
    }
  }
`;

export const ParticipantsModalContext = createContext({} as IParticipantsModalContext);

export const useParticipantsModalContext = () => {
  const context = useContext(ParticipantsModalContext);
  if (!context) throw new Error('useParticipantsModalContext must be used within the ParticipantsModalProvider');

  return context;
};

function ParticipantsModalProvider({ children }) {
  const toast = useToast();
  const { isOpen: isParticipantsModalOpen, onOpen: openParticipantsModal, onClose: closeParticipantsModal } = useDisclosure();
  const {
    isOpen: isParticipantDeleteModalOpen,
    onOpen: openParticipantDeleteModal,
    onClose: closeParticipantDeleteModal,
  } = useDisclosure();

  const { organizationConfig } = useAppContext();

  const [label, setLabel] = useState('');

  const [maxParticipants, setMaxParticipants] = useState<number>();
  const [canDelete, setCanDelete] = useState<boolean>(false);
  const [isUserAllowedToChange, setIsUserAllowedToChange] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: { searchQuery: { searchText: searchQuery, organization: organizationConfig?._id } },
    skip: !searchQuery,
  });

  const [defaultSelectedParticipantsIds, setDefaultSelectedParticipantsIds] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<IUser[]>([]);
  const [participantToDelete, setParticipantToDelete] = useState<IUser | undefined>();
  const { data: selectedUsersData } = useQuery(GET_SELECTED_USERS_FROM_DB, {
    variables: { userQueryInput: { usersIds: defaultSelectedParticipantsIds } },
    skip: defaultSelectedParticipantsIds.length === 0,
  });
  useEffect(() => {
    if (selectedUsersData?.usersByIdFromDb) {
      // Normalize the users data to ensure consistent ID handling
      const normalizedUsers = selectedUsersData.usersByIdFromDb.map((user) => ({
        ...user,
        // Ensure userId is always present for consistency
        userId: user.userId || user._id,
      }));
      setSelectedParticipants(normalizedUsers);
    }
  }, [JSON.stringify(selectedUsersData)]);

  /**
   * Function to check if user is selected participant
   * @param userId ID of user
   * @returns True if user is selected participant
   */
  const isParticipantSelected = (userId: string) => {
    if (selectedParticipants.length === 0) return false;
    return selectedParticipants.findIndex(({ _id, userId: dbUserId }) => _id === userId || dbUserId === userId) > -1;
  };

  /**
   * Function to set user as selected participant
   * @param user user object
   */
  const selectParticipant = (user: IUser) => {
    // Use userId as primary identifier, fallback to _id
    const userIdentifier = user.userId || user._id;

    // If only one participant can be selected replace currently selected with it
    if (maxParticipants === 1) {
      if (isParticipantSelected(userIdentifier)) setSelectedParticipants([]);
      else setSelectedParticipants([user]);
    } else if (isParticipantSelected(userIdentifier))
      {setSelectedParticipants([
        ...selectedParticipants.filter(({ _id, userId: dbUserId }) => _id !== userIdentifier && dbUserId !== userIdentifier),
      ]);}
    else if (selectedParticipants.length === maxParticipants) {
      toast({
        ...toastFailed,
        description: 'Maximum number reached',
      });
    } else setSelectedParticipants([...selectedParticipants, user]);
  };

  const [usersList, setUsersList] = useState<IUser[]>([]);
  useEffect(() => {
    // Get users from Graph API search results
    const graphUsers = data?.searchUsers || [];

    // Get users from internal database (selected participants)
    const dbUsers = selectedParticipants || [];

    // Create a map of userIds to users for quick lookup
    const dbUsersMap = new Map();
    dbUsers.forEach((user) => {
      const key = user.userId || user._id;
      if (key) dbUsersMap.set(key, user);
    });

    // Merge Graph API users with internal database users
    // If a Graph API user doesn't exist in DB, still show them but mark them as not yet in DB
    const mergedUsers = [
      ...dbUsers, // Internal database users (already selected)
      ...graphUsers.filter((graphUser) => {
        // Only show Graph API users that aren't already in selectedParticipants
        const graphUserId = graphUser.userId || graphUser._id;
        return !dbUsersMap.has(graphUserId);
      }),
    ];

    setUsersList(mergedUsers);
  }, [JSON.stringify(data), selectedParticipants.length]);

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      data,
      loading,
      usersList,

      isParticipantsModalOpen,
      openParticipantsModal,
      closeParticipantsModal,
      isParticipantDeleteModalOpen,
      openParticipantDeleteModal,
      closeParticipantDeleteModal,

      isParticipantSelected,
      selectParticipant,

      defaultSelectedParticipantsIds,
      setDefaultSelectedParticipantsIds,
      selectedParticipants,
      setSelectedParticipants,
      participantToDelete,
      setParticipantToDelete,

      label,
      setLabel,
      maxParticipants,
      setMaxParticipants,
      canDelete,
      setCanDelete,
      isUserAllowedToChange,
      setIsUserAllowedToChange,
    }),

    [
      searchQuery,
      data,
      loading,
      usersList,
      isParticipantsModalOpen,
      isParticipantDeleteModalOpen,
      defaultSelectedParticipantsIds,
      selectedParticipants,
      participantToDelete,
      label,
      maxParticipants,
      canDelete,
      isUserAllowedToChange,
    ],
  );

  return <ParticipantsModalContext.Provider data-id="000011" value={value}>{children}</ParticipantsModalContext.Provider>;
}

export default ParticipantsModalProvider;
