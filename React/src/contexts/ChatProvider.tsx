import { createContext, useContext, useEffect, useMemo } from 'react';

import { gql, useLazyQuery } from '@apollo/client';
import { useDisclosure } from '@chakra-ui/react';

import { IChatContext } from '../interfaces/IChatContext';
import { IUser } from '../interfaces/IUser';
import { useAuditContext } from './AuditProvider';
import { useResponseContext } from './ResponseProvider';

export const ChatContext = createContext({} as IChatContext);

const GET_PARTICIPANTS = gql`
  query ($userQuery: UserQueryInput) {
    participants: usersByIdFromDb(userQueryInput: $userQuery) {
      _id
      display: displayName
      userId
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within the ChatProvider');

  return context;
};

function ChatProvider({ children, component }: { children: React.ReactNode; component: 'audit' | 'response' }) {
  const { isOpen: isOpenMessage, onOpen: handleOpenMessage, onClose: handleCloseMessage } = useDisclosure();
  const [getParticipants, { data: participantsData, loading: participantsLoading }] = useLazyQuery(GET_PARTICIPANTS);
  const { audit } = useAuditContext();
  const { response } = useResponseContext();

  useEffect(() => {
    let participants: string[] = [];

    if (component === 'audit' && audit) {
      if (audit.auditorId && audit.auditorId !== '') participants.push(audit.auditorId);

      participants = participants.concat(audit.participantsIds?.filter((id) => id && id !== '') || []);
    }

    if (component === 'response' && response) {
      if (response.accountableId && response.accountableId !== '') participants.push(response.accountableId);

      if (response.responsibleId && response.responsibleId !== '') participants.push(response.responsibleId);

      participants = participants.concat(response.followersIds?.filter((id) => id && id !== '') || []);
      participants = participants.concat(response.contributorsIds?.filter((id) => id && id !== '') || []);
    }

    // Remove duplicates and filter out empty values
    const uniqueParticipants = [...new Set(participants.filter((id) => id && id.trim() !== ''))];

    if (uniqueParticipants.length > 0) {
      getParticipants({
        variables: {
          userQuery: { usersIds: uniqueParticipants },
        },
      });
    }
  }, [
    audit?._id,
    audit?.auditorId,
    audit?.participantsIds?.join(','),
    response?._id,
    response?.accountableId,
    response?.responsibleId,
    response?.followersIds?.join(','),
    response?.contributorsIds?.join(','),
  ]);

  const chatParticipants: IUser[] = useMemo(() => {
    const participants = participantsData?.participants || [];
    // Filter out participants with invalid displayName to prevent toLowerCase errors
    return participants.filter(
      (participant) =>
        participant && participant.displayName && typeof participant.displayName === 'string' && participant.displayName.trim() !== '',
    );
  }, [participantsData]);

  const value = useMemo(
    () => ({ isOpenMessage, handleOpenMessage, handleCloseMessage, participantsLoading, chatParticipants }),
    [isOpenMessage, participantsData, participantsLoading],
  ) as IChatContext;

  return (
    <ChatContext.Provider data-id="000008" value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export default ChatProvider;
