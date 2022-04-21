import { createContext, useContext, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';

import { IAudit } from '../interfaces/IAudit';
import { IAuditModalContext } from '../interfaces/IAuditModalContext';
import { useAppContext } from './AppProvider';

export const AuditModalContext = createContext({} as IAuditModalContext);

const GET_FORM_DATA = gql`
  query {
    auditTypes {
      _id
      name
    }
    questionsCategories {
      _id
      name
    }
    users {
      _id
      displayName
    }
    locations {
      _id
      name
    }
    businessUnits {
      _id
      name
    }
  }
`;

export const useAuditModalContext = () => {
  const context = useContext(AuditModalContext);
  if (!context) {
    throw new Error(
      'useAuditModalContext must be used within the AuditModalProvider',
    );
  }
  return context;
};

const AuditModalProvider = ({ children }) => {
  const { user } = useAppContext();
  const { data, refetch } = useQuery(GET_FORM_DATA);

  const defaultValues: Partial<IAudit> = {
    auditorId: user?._id,
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
  } = useForm({
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
      errors,
      setValue,
      trigger,
      reset,
      refetch,
      audit,
      auditTypes: data?.auditTypes || [],
      locations: data?.locations || [],
      businessUnits: data?.businessUnits || [],
      users: data?.users || [],
    }),
    [control, errors, audit, data?.auditTypes, data],
  ) as IAuditModalContext;

  return (
    <AuditModalContext.Provider value={value}>
      {children}
    </AuditModalContext.Provider>
  );
};

export default AuditModalProvider;
