import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect } from "react";
import JSONfn from 'json-fn';

import { IStore, store } from "../bootstrap/store";
import { IRoles } from "../interfaces/IRoles";

declare global {
  var roles: {
    reader: {
      normal: string[];
      restricted: object;
    };
    systemAdmin: {
      normal: string[];
      restricted: object;
    };
    user: {
      normal: string[];
      restricted: object;
    };
  };
}
const SETTINGS = gql`
  query {
    roles
    settings(type: "configValue") {
      name
      value
      label
      type
      description
      options
    }
  }
`;
const ORGANIZATION = gql`
  query {
    organization {
      _id
      name
      logoUrl
      theme
      licenceExpirationDate
    }
  }
`;

const useInit = () => {
  const { loading: loadingSettings, error: settingsError, data: settingsData } = useQuery(SETTINGS);
  const { loading: loadingOrganization, error: organizationError, data: organizationData } = useQuery(ORGANIZATION);
  const { dispatch }: IStore = useContext(store);

  useEffect(() => {
    if (settingsError) {
      throw settingsError;
    }
    if (settingsData) {
      const parsedRoles = JSONfn.parse(settingsData.roles) as IRoles;
      globalThis.roles = parsedRoles;
      dispatch({ type: 'setRoles', payload: parsedRoles });
      dispatch({ type: 'setSettings', payload: settingsData.settings });
    }
  }, [settingsError, settingsData, dispatch]);

  useEffect(() => {
    if (organizationError) {
      throw organizationError;
    }
    if (organizationData) {
      const { organization } = organizationData;
      dispatch({ type: 'setOrganizationConfig', payload: organization });
      document.title = `Conforme - ${organization.name}`;
    }
  }, [organizationError, organizationData, dispatch]);

  return loadingSettings && loadingOrganization;
};

export default useInit;
