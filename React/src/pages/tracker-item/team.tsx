import React, { useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, HStack, Stack } from '@chakra-ui/react';

import { isPermitted } from '../../components/can';
import Loader from '../../components/Loader';
import MultipleParticipantsSelector from '../../components/Participants/MultipleParticipantsSelector';
import SingleParticipantSelector from '../../components/Participants/SingleParticipantSelector';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID_FROM_DB = gql`
  query (
    $userAccountableQuery: UserQueryInput
    $userResponsibleQuery: UserQueryInput
    $userContibuterQuery: UserQueryInput
    $userFollowersQuery: UserQueryInput
  ) {
    accountable: usersByIdFromDb(userQueryInput: $userAccountableQuery) {
      _id
      userId
      firstName
      lastName
      displayName
      imgUrl
      jobTitle
    }
    responsible: usersByIdFromDb(userQueryInput: $userResponsibleQuery) {
      _id
      userId
      firstName
      lastName
      displayName
      imgUrl
      jobTitle
    }
    contributors: usersByIdFromDb(userQueryInput: $userContibuterQuery) {
      _id
      userId
      firstName
      lastName
      displayName
      imgUrl
      jobTitle
    }
    followers: usersByIdFromDb(userQueryInput: $userFollowersQuery) {
      _id
      userId
      firstName
      lastName
      displayName
      imgUrl
      jobTitle
    }
  }
`;

function Team() {
  const { user } = useAppContext();
  const { response, snapshot, refetch, updateResponse } = useResponseContext();
  const maxParticipants = 20;

  const { data: racf, loading } = useQuery(GET_USERS_BY_ID_FROM_DB, {
    variables: {
      userAccountableQuery: { usersIds: response?.accountableId || [] },
      userResponsibleQuery: { usersIds: response?.responsibleId || [] },
      userContibuterQuery: { usersIds: response?.contributorsIds || [] },
      userFollowersQuery: { usersIds: response?.followersIds || [] },
    },
    skip: !!snapshot,
  });

  const racfData = useMemo(() => {
    if (snapshot) {
      return {
        accountable: response?.accountable && [response.accountable],
        responsible: response?.responsible && [response.responsible],
        contributors: response?.contributors,
        followers: response?.followers,
      };
    }
    return racf;
  }, [JSON.stringify(racf), JSON.stringify(response), snapshot]);

  const accountable: IUser = racfData?.accountable && racfData?.accountable[0];
  const responsible: IUser = racfData?.responsible && racfData?.responsible[0];
  const contributors: IUser[] = racfData?.contributors || [];
  const followers: IUser[] = racfData?.followers || [];

  const isPermittedToManageAccountable = isPermitted({ user, action: 'responses.manageAccountable', data: { response } });
  const isPermittedToManageResponsible = isPermitted({ user, action: 'responses.manageResponsible', data: { response } });
  const isPermittedToManageContributors = isPermitted({ user, action: 'responses.manageContributors', data: { response } });
  const isPermittedToManageFollowers = isPermitted({ user, action: 'responses.manageFollowers', data: { response } });

  const selectParticipants = async (participantsModify) => {
    await updateResponse({
      variables: {
        updateResponseModify: {
          _id: response?._id,
          ...participantsModify,
        },
      },
    });
    refetch();
  };

  if (loading) {
    return (
      <Flex data-id="000806" bg="teamPage.bg" h="full" rounded="20px" w="full">
        <Loader data-id="000807" center />
      </Flex>
    );
  }

  return (
    <Stack
      data-id="000808"
      alignItems={['center', 'flex-start']}
      bg="teamPage.bg"
      border="1px solid"
      borderColor="#CBD5E0"
      borderRadius="8px"
      fontSize="smm"
      fontWeight="bold"
      h={['fit-content', 'full']}
      overflow={['visible', 'auto']}
      px={6}
      py={4}
      spacing="40px"
      w="full"
    >
      <Stack data-id="000809" spacing="6" w="full">
        <HStack data-id="000810" alignItems="flex-start" flexDirection={['column', 'row']} justify="flex-start" spacing={[2, 12]}>
          <SingleParticipantSelector
            data-id="000811"
            isUserAllowedToChange={isPermittedToManageAccountable}
            label="Accountable"
            onChange={(participant) => selectParticipants({ accountableId: participant._id })}
            selectedParticipant={accountable}
          />
          <SingleParticipantSelector
            data-id="000812"
            isUserAllowedToChange={isPermittedToManageResponsible}
            label="Responsible"
            onChange={(participant) => selectParticipants({ responsibleId: participant._id })}
            selectedParticipant={responsible}
          />
        </HStack>
        <MultipleParticipantsSelector
          data-id="000813"
          isUserAllowedToChange={isPermittedToManageContributors}
          label="Contributors"
          maxParticipants={maxParticipants}
          onChange={(participants) => {
            const newIds = participants.map((p) => p.userId || p._id);
            const existingIds = contributors.map((c) => {
              if (typeof c === 'string') return c;
              return c.userId || c._id;
            });

            const mergedIds = Array.from(new Set([...existingIds, ...newIds]));
            selectParticipants({ contributorsIds: mergedIds });
          }}
          onRemove={(participantId, selectedParticipants) => {
            const updated = selectedParticipants.filter((c) => c.userId !== participantId);
            const updatedIds = updated.map((c) => c.userId || c.userId);
            selectParticipants({ contributorsIds: updatedIds });
          }}
          selectedParticipants={contributors}
        />
        <MultipleParticipantsSelector
          data-id="000814"
          isUserAllowedToChange={isPermittedToManageFollowers}
          label="Followers"
          maxParticipants={maxParticipants}
          onChange={(participants) => {
            const newIds = participants.map((p) => p.userId || p._id);
            const existingIds = followers.map((f) => {
              if (typeof f === 'string') return f;
              return f.userId || f._id;
            });
            const mergedIds = Array.from(new Set([...existingIds, ...newIds]));
            selectParticipants({ followersIds: mergedIds });
          }}
          onRemove={(participantId, selectedParticipants) => {
            const updated = selectedParticipants.filter((f) => f.userId !== participantId);
            const updatedIds = updated.map((f) => f.userId || f.userId);
            selectParticipants({ followersIds: updatedIds });
          }}
          selectedParticipants={followers}
        />
      </Stack>
    </Stack>
  );
}

export default Team;

export const teamPageStyles = {
  teamPage: {
    bg: '#FFFFFF',
  },
};
