import { createContext, useContext, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';

import { IAuditTeamContext } from '../interfaces/IAuditTeamContext';
import { IUser } from '../interfaces/IUser';
import { useAppContext } from './AppProvider';

const SEARCH_USERS = gql`
  query ($searchQuery: SearchQuery) {
    searchUsers(searchQuery: $searchQuery) {
      _id
      firstName
      lastName
      displayName
      email
    }
  }
`;

export const AuditTeamContext = createContext({} as IAuditTeamContext);

export const useAuditTeamContext = () => {
  const context = useContext(AuditTeamContext);
  if (!context)
    throw new Error('useAuditTeamContext must be used within the TeamProvider');

  return context;
};

const AuditTeamProvider = ({ children }) => {
  const { user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAuditor, setSelectedAuditor] = useState<Partial<IUser>>(user!);
  const [selectedParticipants, setSelectedParticipants] = useState<
    Partial<IUser[]>
  >([]);
  const { data, loading } = useQuery(SEARCH_USERS, {
    variables: { searchQuery: { searchText: searchQuery } },
  });

  const value = useMemo(
    () => ({
      loading,
      data,
      searchQuery,
      setSearchQuery,
      selectedAuditor,
      setSelectedAuditor,
      selectedParticipants,
      setSelectedParticipants,
    }),

    [data, loading, searchQuery, selectedAuditor, selectedParticipants],
  );

  return (
    <AuditTeamContext.Provider value={value}>
      {children}
    </AuditTeamContext.Provider>
  );
};

export default AuditTeamProvider;
