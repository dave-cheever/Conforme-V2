import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import JSONfn from 'json-fn';

import { IRoles } from "../interfaces/IRoles";
import { useAppContext } from "../contexts/AppProvider";

declare global {
  var roles: {
    reader: {
      normal: string[];
      restricted: object;
    };
    admin: {
      normal: string[];
      restricted: object;
    };
    user: {
      normal: string[];
      restricted: object;
    };
  };
};

const SETTINGS = gql`
  query {
    roles
    settings(type: "defaultSettings") {
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
  }
`;

const ORGANIZATION = gql`
  query {
    organization {
      _id
      name
      logoUrl
      bgImageUrl
      bgImageTabletUrl
      theme
      addons
    }
  }
`;

const useInit = () => {
  const { loading: loadingSettings, error: settingsError, data: settingsData } = useQuery(SETTINGS);
  const { loading: loadingOrganization, error: organizationError, data: organizationData } = useQuery(ORGANIZATION);
  const {
    setRoles,
    setOrganizationConfig,
    setSettings
  } = useAppContext();

  useEffect(() => {
    if (settingsData) {
      const parsedRoles = JSONfn.parse(settingsData.roles) as IRoles;
      globalThis.roles = parsedRoles;
      setRoles(parsedRoles);
      setSettings(settingsData?.settings || []);
    }
  }, [settingsError, settingsData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (organizationError) {
      throw organizationError;
    }
    if (organizationData) {
      const { organization } = organizationData;
      setOrganizationConfig(organization);
      document.title = `Conforme - ${organization.name}`;
    }
  }, [organizationError, organizationData]); // eslint-disable-line react-hooks/exhaustive-deps

  return loadingSettings && loadingOrganization;
};

export default useInit;
