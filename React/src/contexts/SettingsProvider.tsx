import React, { createContext, useContext, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { ISettingsContext } from "../interfaces/ISettingsProvider";
import { ISetting } from "../interfaces/ISettings";

export const SettingsContext = createContext({} as ISettingsContext);

const GET_SETTINGS_DATA = gql`
  query {
    settings(type: "configValue") {
        name
        value
        label
        type
        description
        options
    }
    categories {
        _id
        name
      }
    functionalAreas {
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
      defaultCategory: '',
      defaultFunctionalArea: '',
  },
}, {
  name: 'Email templates',
  fields: {
  },
}, {
  name: 'Notifications',
  fields: {
      newItemAdded: false,
      actionOverDue: false,
      actionChanges: true,
  }
},];

const defaultValues: Partial<ISetting> = {
  ...settingSections[0].fields, // Defaults
  ...settingSections[1].fields, // Email Templates
  ...settingSections[2].fields, // Notifications
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within the ComplianceItemModalProvider');
  }
  return context;
};

const SettingsProvider = (props) => {
  const { data, loading } = useQuery(GET_SETTINGS_DATA);
  const {
    control,
    formState: { errors },
    setValue: setFormValue,
    trigger,
  } = useForm({
    mode: "all",
    defaultValues,
  });
  const [activeTab,setActiveTab] = useState<0|1|2>(0);
  const setValue = (name, value) => {
    setFormValue(name, value);
    trigger(name, value);
  };

  const value = useMemo(() => ({
    control, errors, setValue, trigger,
    loading,
    settings: data?.settings || [],
    categories: data?.categories || [],
    regulatoryBodies: data?.regulatoryBodies || [],
    functionalAreas: data?.functionalAreas || [],
    businessUnits: data?.businessUnits || [],
    activeTab, setActiveTab,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    control, errors,
    data,
    activeTab,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {props.children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider;
