import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import JSONfn from 'json-fn';

import { useAppContext } from '../contexts/AppProvider';
import { IRoles } from '../interfaces/IRoles';

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
      modules {
        type
        name
        path
        showInNavigation
      }
      revokedPermissions
    }
  }
`;

const useInit = () => {
  const { loading: loadingSettings, error: settingsError, data: settingsData } = useQuery(SETTINGS);
  const { loading: loadingOrganization, error: organizationError, data: organizationData } = useQuery(ORGANIZATION);
  const { user, setRoles, setOrganizationConfig, setModule, setSettings } = useAppContext();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    if (settingsData) {
      const parsedRoles = JSONfn.parse(settingsData.roles) as IRoles;
      globalThis.roles = parsedRoles;
      setRoles(parsedRoles);
      setSettings(settingsData?.settings || []);
    }
  }, [settingsError, settingsData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (organizationError) throw organizationError;

    if (organizationData) {
      const { organization } = organizationData;
      setOrganizationConfig(organization);

      const modulePath = location.pathname.split('/')[1];
      let module = organization.modules.find((m) => m.path === modulePath);
      if (!module) {
        [module] = organization.modules;
        history.push(module.path);
      }

      setModule(module);
      if (module && user) document.title = `${module.name} - ${organization.name} - Conforme`;
      else document.title = `${organization.name} - Conforme`;
    }
  }, [user, organizationError, organizationData]); // eslint-disable-line react-hooks/exhaustive-deps

  return loadingSettings && loadingOrganization;
};

export default useInit;
