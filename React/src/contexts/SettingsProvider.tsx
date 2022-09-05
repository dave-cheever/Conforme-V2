import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useQuery } from '@apollo/client';

import { ISettingsContext } from '../interfaces/ISettingsProvider';
import { useAppContext } from './AppProvider';

export const SettingsContext = createContext({} as ISettingsContext);

const GET_SETTINGS_DATA = gql`
  query GetSettings($moduleId: ID) {
    defaultSettings: settings(type: "defaultSettings", moduleId: $moduleId) {
      _id
      name
      value
      label
      type
      description
      inputType
      placeholder
      help
      options
    }
    notificationSettings: settings(type: "notificationSettings", moduleId: $moduleId) {
      _id
      name
      value
      label
      type
      description
      inputType
      placeholder
      help
    }
    categories {
      _id
      name
    }
    regulatoryBodies {
      _id
      name
    }
    businessUnits {
      _id
      name
    }
  }
`;

export interface settingsSection {
  name: string;
  fields?: {
    [fieldName: string]: any;
  };
}

export const settingSections: settingsSection[] = [
  {
    name: 'Defaults',
    fields: {
      defaultBusinessUnit: '',
      defaultRegulatoryBody: '',
      defaultCategory: '',
    },
  },
  {
    name: 'Email templates',
  },
  {
    name: 'Notifications',
    fields: {
      newItemAdded: false,
      actionOverDue: false,
    },
  },
];

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettingsContext must be used within the TrackerItemModalProvider');
  return context;
};

const SettingsProvider = ({ children }) => {
  const { module } = useAppContext();
  const { data, loading, refetch } = useQuery(GET_SETTINGS_DATA, {
    variables: {
      moduleId: module?._id,
    },
  });

  const defaultSettingsValues: object = useMemo(() => {
    let values = {};
    data?.defaultSettings?.forEach(({ name, value }) => {
      values = { ...values, [name]: value };
    });
    return values;
  }, [data]);

  const defaultNotificationValues: object = useMemo(() => {
    let values = {};
    data?.notificationSettings?.forEach(({ name, value }) => {
      values = { ...values, [name]: value };
    });
    return values;
  }, [data]);

  const defaultValues = useMemo(
    () => ({
      ...settingSections[0].fields, // Defaults
      ...settingSections[1].fields, // Email Templates
      ...settingSections[2].fields, // Notifications
      ...defaultSettingsValues,
      ...defaultNotificationValues,
    }),
    [defaultSettingsValues, defaultNotificationValues],
  );

  const {
    control,
    formState: { errors },
    setValue: setFormValue,
    trigger,
    reset,
    watch,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const [activeTab, setActiveTab] = useState<number>(0);

  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const formValues = watch();

  const value = useMemo(
    () => ({
      control,
      errors,
      setValue,
      trigger,
      loading,
      refetch,
      defaultSettings: data?.defaultSettings || [],
      notificationSettings: data?.notificationSettings || [],
      categories: data?.categories || [],
      regulatoryBodies: data?.regulatoryBodies || [],
      businessUnits: data?.businessUnits || [],
      activeTab,
      setActiveTab,
      formValues,
      reset,
    }),

    [control, errors, data, activeTab, formValues, reset],
  ) as unknown as ISettingsContext;

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
