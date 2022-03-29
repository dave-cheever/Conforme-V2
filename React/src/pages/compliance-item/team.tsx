import React, { useEffect, useMemo } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Flex, Grid, Stack } from '@chakra-ui/react';

import Loader from '../../components/Loader';
import AvatarUser from '../../components/Team/AvatarUser';
import TeamHeader from '../../components/Team/TeamHeader';
import TeamModal from '../../components/Team/TeamModal';
import { useResponseContext } from '../../contexts/ResponseProvider';
import TeamProvider, { useTeamContext } from '../../contexts/TeamProvider';
import { IUser } from '../../interfaces/IUser';

const GET_USERS_BY_ID = gql`
  query (
    $userAccountableQuery: UserQueryInput
    $userResponsibleQuery: UserQueryInput
    $userContibuterQuery: UserQueryInput
    $userFollowersQuery: UserQueryInput
  ) {
    responseAccountable: usersById(userQueryInput: $userAccountableQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    responseResponsible: usersById(userQueryInput: $userResponsibleQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    contributors: usersById(userQueryInput: $userContibuterQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
    followers: usersById(userQueryInput: $userFollowersQuery) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

const Team = () => {
  const { response, snapshot } = useResponseContext();
  const {
    data,
    filterType,
    searchQuery,
    onOpen,
    refetchUsers,
    setFilterType,
    setSelectedParticipants,
    setUserSearchResults,
  } = useTeamContext();

  const maxDelegates = 5;

  const { data: racf, loading } = useQuery(GET_USERS_BY_ID, {
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
        responseAccountable: response?.accountable && [response.accountable],
        responseResponsible: response?.responsible && [response.responsible],
        contributors: response?.contributors,
        followers: response?.followers,
      };
    }
    return racf;
  }, [racf, response, snapshot]);

  useEffect(() => {
    refetchUsers();
    if (filterType === 'responsible' || filterType === 'accountable')
      setSelectedParticipants([]);

    if (data?.searchUsers && searchQuery) {
      const filteredUsers = data.searchUsers.filter(
        ({ _id }) => response && !response[filterType].includes(_id),
      );

      setUserSearchResults(filteredUsers);
    } else setUserSearchResults([]);
  }, [searchQuery, data]);

  useEffect(() => {
    setSelectedParticipants([]);
  }, [filterType]);

  const accountable: IUser =
    racfData?.responseAccountable &&
    racfData?.responseAccountable?.length !== 0 &&
    racfData?.responseAccountable[0];
  const responsible: IUser =
    racfData?.responseResponsible &&
    racfData?.responseResponsible?.length !== 0 &&
    racfData?.responseResponsible[0];

  if (loading) {
    return (
      <Flex bg="teamPage.bg" h="full" rounded="20px" w="full">
        <Loader center />
      </Flex>
    );
  }

  return (
    <Stack
      alignItems={['center', 'flex-start']}
      bg="teamPage.bg"
      fontSize="smm"
      fontWeight="bold"
      h={['fit-content', 'full']}
      overflow={['visible', 'auto']}
      p="25px 30px"
      rounded="20px"
      spacing="40px"
      w="full"
    >
      <TeamModal />
      <Flex>
        <Flex flexDir="column">
          <TeamHeader
            action="responses"
            header="Accountable"
            isButtonVisible={!response?.accountableId}
            onOpen={onOpen}
            setFilterType={() => setFilterType('accountableId')}
          />
          {racfData?.responseAccountable &&
            racfData?.responseAccountable?.length !== 0 && (
              <Flex>
                <AvatarUser
                  action="responses"
                  isReplaceable
                  permission="accountable"
                  user={accountable}
                />
              </Flex>
            )}
        </Flex>
        <Flex flexDir="column" ml="26px">
          <TeamHeader
            action="responses.manageResponsible"
            header="Responsible"
            isButtonVisible={!response?.responsibleId}
            onOpen={onOpen}
            setFilterType={() => setFilterType('responsibleId')}
          />
          {racfData?.responseResponsible &&
            racfData?.responseResponsible?.length !== 0 && (
              <Flex>
                <AvatarUser
                  action="responses.manageResponsible"
                  isReplaceable
                  permission="responsible"
                  user={responsible}
                />
              </Flex>
            )}
        </Flex>
      </Flex>
      <Flex>
        <Flex flexDir="column">
          <TeamHeader
            action="responses.manageContributor"
            header="Contributors"
            isButtonVisible={response?.contributorsIds?.length! < maxDelegates}
            onOpen={onOpen}
            setFilterType={() => setFilterType('contributorsIds')}
          />
          <Grid
            gap={[0, 6]}
            templateColumns={[
              'repeat(3, 1fr)',
              'repeat(4, 1fr)',
              'repeat(6, 1fr)',
            ]}
            w="full"
          >
            {(racfData?.contributors || [])
              .sort((a, b) => a.displayName.localeCompare(b.displayName))
              .map((contributor) => (
                <AvatarUser
                  action="responses.manageContributor"
                  key={contributor._id}
                  permission="contributor"
                  user={contributor}
                />
              ))}
          </Grid>
        </Flex>
      </Flex>
      <Flex>
        <Flex flexDir="column">
          <TeamHeader
            action="responses.manageMultipleFollowers"
            header="Followers"
            onOpen={onOpen}
            setFilterType={() => setFilterType('followersIds')}
          />
          <Grid
            gap={[0, 6]}
            templateColumns={[
              'repeat(3, 1fr)',
              'repeat(4, 1fr)',
              'repeat(6, 1fr)',
            ]}
            w="full"
          >
            {(racfData?.followers || [])
              .sort((a, b) => a.displayName.localeCompare(b.displayName))
              .map((follower) => (
                <AvatarUser
                  action="responses.manageMultipleFollowers"
                  key={follower._id}
                  permission="follower"
                  user={follower}
                />
              ))}
          </Grid>
        </Flex>
      </Flex>
    </Stack>
  );
};

const TeamWithContext = (props) => (
  <TeamProvider {...props}>
    <Team {...props} />
  </TeamProvider>
);

export default TeamWithContext;

export const teamPageStyles = {
  teamPage: {
    bg: '#FFFFFF',
    modal: {
      searchIcon: '#434B4F',
      inputBorder: '#cdcdd5',
    },
    radioButtonFont: '#818197',
    button: {
      add: {
        bg: '#462AC4',
        color: '#FFFFFF',
      },
      addDelegates: {
        bg: '#818197',
        color: '#FFFFFF',
      },
    },
  },
};
