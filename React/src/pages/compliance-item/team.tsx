import React, { useEffect } from "react";
import {  Flex, Stack } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";

import AvatarUser from "../../components/Team/AvatarUser";
import { IUser } from "../../interfaces/IUser";
import { useResponseContext } from "../../contexts/ResponseProvider";
import TeamHeader from "../../components/Team/TeamHeader";
import TeamProvider, { useTeamContext } from "../../contexts/TeamProvider";
import TeamModal from "../../components/Team/TeamModal";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

const Team = () => {
  const { response } = useResponseContext();
  const { data, filterType, searchQuery, onOpen, refetchUsers, setFilterType, setSelectedRadio, setUserSearchResults } = useTeamContext();
  const maxDelegates = 5;
  const { data: { usersById: responseAccountable } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.accountableId || [] } } });
  const { data: { usersById: responseResponsible } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.responsibleId || [] } } });
  const { data: { usersById: contributors } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.contributorsIds || [] } } });
  const { data: { usersById: followers } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.followersIds || [] } } });

  useEffect(() => {
    refetchUsers();
    setSelectedRadio("");
    if (data?.searchUsers && searchQuery) {
      const filteredUsers = data.searchUsers.filter(({ _id }) => response && !response[filterType].includes(_id));

      setUserSearchResults(filteredUsers);
    } else {
      setUserSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, data]);
  
  const accountable: IUser = responseAccountable && responseAccountable?.length !== 0 && responseAccountable[0];
  const responsible: IUser = responseResponsible && responseResponsible?.length !== 0 && responseResponsible[0];
  
  return (
    <Stack
      h="calc(100% - 25px)"
      alignItems={["center", "flex-start"]}
      w={["full", "calc(100% - 25px)", "calc(100% - 400px)"]}
      spacing="40px"
      p="25px 30px"
      bg="teamPage.bg"
      rounded="20px"
      fontSize="smm"
      fontWeight="bold"
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
          {responseAccountable && responseAccountable.length !== 0 && 
            <Flex>
              <AvatarUser user={accountable} permission="accountable" action="responses" />
            </Flex>
          }
        </Flex>
        <Flex flexDir="column" ml="40px">
          <TeamHeader 
            header="Responsible" 
            onOpen={onOpen} 
            setFilterType={() => setFilterType("responsibleId")} 
            isButtonVisible={!response?.responsibleId}
            action="responses.manageResponsible"
          />
          {responseResponsible && responseResponsible.length !== 0 && 
            <Flex>
              <AvatarUser user={responsible} permission="responsible" action="responses.manageResponsible" />
            </Flex>
          }
        </Flex>
      </Flex>
      <Flex>
        <Flex flexDir="column">
          <TeamHeader 
            header="Contributors" 
            onOpen={onOpen} 
            setFilterType={() => setFilterType("contributorsIds")} 
            isButtonVisible={response?.contributorsIds?.length! < maxDelegates}
            action="responses.manageContributor"
          />
          <Flex>
            {contributors?.map(contributor => 
              <AvatarUser key={contributor._id} user={contributor} permission="contributor" action="responses.manageContributor" />
            )}
            </Flex>
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
          <Flex>
            {followers?.map(follower => 
              <AvatarUser key={follower._id} user={follower} permission="follower" action="responses.manageMultipleFollowers" />
            )}
          </Flex>
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
      inputBorder: "#cdcdd5"
    },
    radioButtonFont: "#818197",
    button: {
      add: {
        bg: "#462AC4",
        color: "#FFFFFF",
      },
      addDelegates: {
        bg: "#818197",
        color: "#FFFFFF"
      } 
    }
  }
};
