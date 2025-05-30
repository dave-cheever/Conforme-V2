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
      firstName
      lastName
      displayName
      imgUrl
    }
    responsible: usersByIdFromDb(userQueryInput: $userResponsibleQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    contributors: usersByIdFromDb(userQueryInput: $userContibuterQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    followers: usersByIdFromDb(userQueryInput: $userFollowersQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
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
      (<Flex bg="teamPage.bg" data-id="34d7966a0c58" h="full" rounded="20px" w="full">
        <Loader center data-id="4bd3243c6160" />
      </Flex>)
    );
  }

  return (
    (<Stack
      alignItems={['center', 'flex-start']}
      bg="teamPage.bg"
      data-id="38e4414c2140"
      fontSize="smm"
      fontWeight="bold"
      h={['fit-content', 'full']}
      overflow={['visible', 'auto']}
      px={6}
      py={4}
      rounded="20px"
      spacing="40px"
      w="full">
      <Stack data-id="0ca0a7e8d5f7" spacing={12} w="full">
        <HStack data-id="9da01514a58d" justify="flex-start" spacing={12}>
          <SingleParticipantSelector
            data-id="11f0371f724c"
            isUserAllowedToChange={isPermittedToManageAccountable}
            label="Accountable"
            onChange={(participant) => selectParticipants({ accountableId: participant._id })}
            selectedParticipant={accountable} />
          <SingleParticipantSelector
            data-id="25b77c2a2052"
            isUserAllowedToChange={isPermittedToManageResponsible}
            label="Responsible"
            onChange={(participant) => selectParticipants({ responsibleId: participant._id })}
            selectedParticipant={responsible} />
        </HStack>
        <MultipleParticipantsSelector
          data-id="5fc50b465ef6"
          isUserAllowedToChange={isPermittedToManageContributors}
          label="Contributors"
          maxParticipants={maxParticipants}
          onChange={(participants) => selectParticipants({ contributorsIds: participants.map(({ _id }) => _id) })}
          selectedParticipants={contributors} />
        <MultipleParticipantsSelector
          data-id="cc552ceab692"
          isUserAllowedToChange={isPermittedToManageFollowers}
          label="Followers"
          maxParticipants={maxParticipants}
          onChange={(participants) => selectParticipants({ followersIds: participants.map(({ _id }) => _id) })}
          selectedParticipants={followers} />
      </Stack>
    </Stack>)
  );
}

export default Team;

export const teamPageStyles = {
  teamPage: {
    bg: '#FFFFFF',
  },
};
