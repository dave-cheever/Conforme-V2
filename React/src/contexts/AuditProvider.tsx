import { createContext, useContext, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import { useToast } from '@chakra-ui/react';

import { IAuditContext } from '../interfaces/IAuditContext';

export const AuditContext = createContext({} as IAuditContext);

const GET_AUDIT = gql`
  query GetAudit($auditQueryInput: AuditQueryInput) {
    audits(auditQueryInput: $auditQueryInput) {
      _id
      walkType
      reference
      auditorId
      participantsIds
      auditType {
        _id
        name
      }
      site {
        _id
        name
      }
      area {
        _id
        name
      }
      auditor {
        _id
        displayName
      }
      participants {
        _id
        displayName
      }
    }
  }
`;

export const useAuditContext = () => {
  const context = useContext(AuditContext);
  if (!context)
    throw new Error('useAuditContext must be used within the AuditProvider');

  return context;
};

const AuditProvider = ({ children }) => {
  const toast = useToast();
  const { id }: { id: string } = useParams();
  const history = useHistory();

  const { data, loading, error, refetch } = useQuery(GET_AUDIT, {
    variables: { auditQueryInput: { _id: id } },
  });

  const audit = data?.audits[0];
  const site = audit?.site;
  const area = audit?.area;
  const auditor = audit?.auditor;
  const participants = audit?.participants;

  useEffect(() => {
    if (!loading && error) {
      toast({
        title: 'Audit not found',
        description: 'Audit does not exist',
      });
      history.push('/');
    }
  }, [error]);

  const value = useMemo(
    () => ({
      audit,
      auditor,
      participants,
      site,
      area,
      loading,
      refetch,
    }),
    [audit, auditor, participants, site, area, loading],
  );

  return (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
  );
};

export default AuditProvider;
