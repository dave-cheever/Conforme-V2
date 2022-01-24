import React, { useEffect } from "react";
import { Flex, Grid, Stack } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import AvatarUser from "../../components/Team/AvatarUser";
import { IUser } from "../../interfaces/IUser";
import { useResponseContext } from "../../contexts/ResponseProvider";
import TeamHeader from "../../components/Team/TeamHeader";
import TeamProvider, { useTeamContext } from "../../contexts/TeamProvider";
import TeamModal from "../../components/Team/TeamModal";
import Loader from "../../components/Loader";

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
  const { response } = useResponseContext();
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

  const { data: racfData, loading } = useQuery(GET_USERS_BY_ID, {
    variables: {
      userAccountableQuery: { usersIds: response?.accountableId || [] },
      userResponsibleQuery: { usersIds: response?.responsibleId || [] },
      userContibuterQuery: { usersIds: response?.contributorsIds || [] },
      userFollowersQuery: { usersIds: response?.followersIds || [] },
    },
  });

  useEffect(() => {
    refetchUsers();
    if(filterType === "responsible" || filterType === "accountable"){
      setSelectedParticipants([]);
    }
    if (data?.searchUsers && searchQuery) {
      const filteredUsers = data.searchUsers.filter(
        ({ _id }) => response && !response[filterType].includes(_id)
      );

      setUserSearchResults(filteredUsers);
    } else {
      setUserSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, data]);


  useEffect(() => {
    setSelectedParticipants([]);
  // eslint-disable-next-line
  },[filterType]);

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
      <Flex w="full" h="full" rounded="20px" bg="teamPage.bg">
        <Loader center={true} />
      </Flex>
    )
  }

  return (
    <Stack
      h={["fit-content","full"]}
      alignItems={["center", "flex-start"]}
      w="full"
      spacing="40px"
      p="25px 30px"
      bg="teamPage.bg"
      rounded="20px"
      fontSize="smm"
      fontWeight="bold"
      overflow={["visible","auto"]}
    >
      <TeamModal />
      <Flex>
        <Flex flexDir="column">
          <TeamHeader
            header="Accountable"
            onOpen={onOpen}
            setFilterType={() => setFilterType("accountableId")}
            isButtonVisible={!response?.accountableId}
            action="responses"
          />
          {racfData?.responseAccountable &&
            racfData?.responseAccountable?.length !== 0 && (
              <Flex>
                <AvatarUser
                  user={accountable}
                  permission="accountable"
                  action="responses"
                  isReplaceable
                />
              </Flex>
            )}
        </Flex>
        <Flex flexDir="column" ml="40px">
          <TeamHeader
            header="Responsible"
            onOpen={onOpen}
            setFilterType={() => setFilterType("responsibleId")}
            isButtonVisible={!response?.responsibleId}
            action="responses.manageResponsible"
          />
          {racfData?.responseResponsible &&
            racfData?.responseResponsible?.length !== 0 && (
              <Flex>
                <AvatarUser
                  user={responsible}
                  permission="responsible"
                  action="responses.manageResponsible"
                />
              </Flex>
            )}
        </Flex>
      </Flex>
      <Flex w="full" >
        <Flex w="full" flexDir="column" justifyContent="center">
          <TeamHeader
            header="Contributors"
            onOpen={onOpen}
            setFilterType={() => setFilterType("contributorsIds")}
            isButtonVisible={response?.contributorsIds?.length! < maxDelegates}
            action="responses.manageContributor"
          />
          <Grid w="full" templateColumns={["repeat(3, 1fr)","repeat(4, 1fr)","repeat(6, 1fr)"]} gap={[2,6]}>
            {racfData?.contributors?.map((contributor) => (
              <AvatarUser
                key={contributor._id}
                user={contributor}
                permission="contributor"
                action="responses.manageContributor"
              />
            ))}
          </Grid>
        </Flex>
      </Flex>
      <Flex>
        <Flex flexDir="column">
          <TeamHeader
            header="Followers"
            onOpen={onOpen}
            setFilterType={() => setFilterType("followersIds")}
            action="responses.manageMultipleFollowers"
          />
          <Grid w="full" templateColumns={["repeat(3, 1fr)","repeat(4, 1fr)","repeat(6, 1fr)"]} gap={[0,6]}>
            {racfData?.followers?.map((follower) => (
              <AvatarUser
                key={follower._id}
                user={follower}
                permission="follower"
                action="responses.manageMultipleFollowers"
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
    bg: "#FFFFFF",
    modal: {
      searchIcon: "#434B4F",
      inputBorder: "#cdcdd5",
    },
    radioButtonFont: "#818197",
    button: {
      add: {
        bg: "#462AC4",
        color: "#FFFFFF",
      },
      replace: {
        bg: "#F0F2F5",
        color: "#818197"
      },
      addDelegates: {
        bg: "#818197",
        color: "#FFFFFF",
      },
    },
  },
};
