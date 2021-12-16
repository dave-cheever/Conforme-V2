import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { ISettingsContext } from "../interfaces/ISettingsProvider";

export const SettingsContext = createContext({} as ISettingsContext);

const GET_SETTINGS_DATA = gql`
  query {
    defaultSettings: settings(type: "defaultSettings") {
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
    notificationSettings: settings(type: "notificationSettings") {
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

export const settingSections: settingsSection[] = [{
  name: 'Defaults',
  fields: {
      defaultBusinessUnit : '',
      defaultRegulatoryBody: '',
      defaultCategory: ''
  },
}, {
  name: 'Email templates'
}, {
  name: 'Notifications',
  fields: {
      newItemAdded: false,
      actionOverDue: false,
  }
},];

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within the ComplianceItemModalProvider');
  }
  return context;
};

const SettingsProvider = (props) => {
  const { data, loading, refetch } = useQuery(GET_SETTINGS_DATA);

  const defaultSettingsValues:object = useMemo(() => {
    let values = {};
    data?.defaultSettings?.map(({name, value}) => {
      return values = {...values, [name]: value};
    });
    return values;
  // eslint-disable-next-line
  },[data]);

  const defaultNotificationValues:object = useMemo(() => {
    let values = {};
    data?.notificationSettings?.map(({name, value}) => {
      return values = {...values, [name]: value};
    });
    return values;
  // eslint-disable-next-line
  },[data]);

  const defaultValues = useMemo(() => {
    return{
    ...settingSections[0].fields, // Defaults
    ...settingSections[1].fields, // Email Templates
    ...settingSections[2].fields, // Notifications
    ...defaultSettingsValues,
    ...defaultNotificationValues
  };},[defaultSettingsValues, defaultNotificationValues]);

  const {
    control,
    formState: { errors, dirtyFields },
    setValue: setFormValue,
    trigger,
    reset, 
    watch
  } = useForm({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  },[// eslint-disable-line react-hooks/exhaustive-deps
    defaultValues]);

  const [activeTab,setActiveTab] = useState<number>(0);
  
  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const formValues = watch();

  const value = useMemo(() => ({
    control, errors, setValue, trigger,
    loading,
    refetch,
    defaultSettings: data?.defaultSettings || [],
    notificationSettings: data?.notificationSettings || [],
    categories: data?.categories || [],
    regulatoryBodies: data?.regulatoryBodies || [],
    businessUnits: data?.businessUnits || [],
    activeTab, setActiveTab,
    formValues,
    dirtyFields,
    reset,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    control, errors,
    data,
    activeTab,
    formValues,
    dirtyFields,
    reset
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider;
