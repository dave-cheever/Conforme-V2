import { createContext, useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';

import { IAudit } from '../interfaces/IAudit';
import { IAuditModalContext } from '../interfaces/IAuditModalContext';
import { IUser } from '../interfaces/IUser';
import { useAppContext } from './AppProvider';

export const AuditModalContext = createContext({} as IAuditModalContext);

const GET_FORM_DATA = gql`
  query ($moduleId: ID!) {
    auditTypes {
      _id
      name
      recurring
      businessUnitScope
    }
    questionsCategories {
      _id
      name
    }
    users {
      _id
      displayName
    }
    locations(moduleId: $moduleId) {
      _id
      name
    }
    businessUnits(moduleId: $moduleId) {
      _id
      name
    }
  }
`;

export const useAuditModalContext = () => {
  const context = useContext(AuditModalContext);
  if (!context) throw new Error('useAuditModalContext must be used within the AuditModalProvider');

  return context;
};

function AuditModalProvider({ children }) {
  const { user, module } = useAppContext();
  const { data, refetch } = useQuery(GET_FORM_DATA, { variables: { moduleId: module?._id }, skip: !module?._id });
  const auditTypes = data?.auditTypes || [];
  const locations = data?.locations || [];
  const businessUnits = data?.businessUnits || [];
  const users = data?.users || [];

  const [selectedAuditor, setSelectedAuditor] = useState<IUser>(user!);
  const [selectedParticipants, setSelectedParticipants] = useState<IUser[]>([]);

  const defaultValues: Partial<IAudit> = {
    auditorId: user?.userId,
    participantsIds: [],
    metatags: {
      addedAt: new Date(),
    },
  };

  const {
    control,
    formState: { errors },
    watch,
    setValue: setFormValue,
    trigger,
    reset,
    resetField,
  } = useForm<IAudit>({
    mode: 'all',
    defaultValues,
  });
  const audit = watch() as Partial<IAudit>;

  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const value = useMemo(
    () => ({
      control,
      defaultValues,
      errors,
      setValue,
      trigger,
      reset,
      resetField,
      refetch,
      audit,
      auditTypes,
      locations,
      businessUnits,
      users,
      selectedAuditor,
      setSelectedAuditor,
      selectedParticipants,
      setSelectedParticipants,
    }),
    [control, errors, audit, data?.auditTypes, data, selectedAuditor, selectedParticipants],
  ) as IAuditModalContext;

  return <AuditModalContext.Provider value={value}>{children}</AuditModalContext.Provider>;
}

export default AuditModalProvider;
