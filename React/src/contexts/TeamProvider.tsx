import { gql, useQuery } from "@apollo/client";
import { useDisclosure } from "@chakra-ui/react";
import React, { createContext, useContext, useMemo, useState } from "react";

import { ITeamContext } from "../interfaces/ITeamContext";
import { IUser } from "../interfaces/IUser";

const SEARCH_USERS = gql`
  query ($searchQuery: SearchQuery) {
    searchUsers(searchQuery: $searchQuery) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

export const TeamContext = createContext({} as ITeamContext);

export const useTeamContext = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error ('useTeamContext must be used within the TeamProvider');
  }
  return context;
};

const TeamProvider = (props: any) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [userSearchResults, setUserSearchResults] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const [filterType, setFilterType] = useState("");
  const { data, loading, refetch: refetchUsers } = useQuery(SEARCH_USERS, { variables: { searchQuery: { searchText: searchQuery } } });
  
  const value = useMemo(() => ({
    data, loading, refetchUsers,
    isOpen, onOpen, onClose,
    userSearchResults, setUserSearchResults,
    searchQuery, setSearchQuery,
    selectedRadio, setSelectedRadio,
    filterType, setFilterType
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    data, loading,
    filterType,
    isOpen,
    userSearchResults,
    searchQuery,
    selectedRadio
  ]);

  return (
    <TeamContext.Provider value={value}>
      {props.children}
    </TeamContext.Provider>
  )
}

export default TeamProvider;
