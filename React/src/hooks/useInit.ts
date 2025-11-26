import { useEffect } from 'react';
import { initReactI18next } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import i18n from 'i18next';
import JSONfn from 'json-fn';

import { useAppContext } from '../contexts/AppProvider';
import { IRoles } from '../interfaces/IRoles';
import useNavigate from './useNavigate';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {},
    lng: 'en', // if you're using a language detector, do not define the lng option
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

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
      scope {
        moduleId
      }
    }
  }
`;

const ORGANIZATION = gql`
  query {
    organization {
      _id
      name
      logoUrl
      logoUrlMobile
      bgImageUrl
      bgImageTabletUrl
      theme
      modules {
        _id
        type
        defaultFilters
        name
        path
        showInNavigation
        translations
        customQuestionsInDashboard
        featureFlags
      }
      revokedPermissions
      loginText
      logoutText
    }
  }
`;

const useInit = () => {
  const { user, setRoles, setOrganizationConfig, setModule, setSettings } = useAppContext();
  const { loading: loadingSettings, error: settingsError, data: settingsData } = useQuery(SETTINGS);
  const { loading: loadingOrganization, error: organizationError, data: organizationData } = useQuery(ORGANIZATION);
  const location = useLocation();
  const { navigate } = useNavigate();

  useEffect(() => {
    try {
      if (settingsData) {
        const parsedRoles = JSONfn.parse(settingsData.roles) as IRoles;
        globalThis.roles = parsedRoles;
        setRoles(parsedRoles);
        setSettings(settingsData?.settings || []);
      }
    } catch (error) {
      console.error('Error in settings useEffect:', error);
    }
  }, [settingsError, JSON.stringify(settingsData)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      if (organizationError) {
        console.error('Organization error:', organizationError);
        return;
      }

      if (organizationData) {
        const { organization } = organizationData;
        setOrganizationConfig(organization);

        const modulePath = location.pathname.split('/')[1];
        let module = organization.modules.find((m) => m.path === modulePath);
        if (!module) {
          [module] = organization.modules;
          navigate(`/${module.path}`);
        }

        setModule(module);
        i18n.addResourceBundle('en', 'translation', module.translations || {});
        if (module && user) document.title = `${module.name} - ${organization.name} - Conforme`;
        else document.title = `${organization.name} - Conforme`;
      }
    } catch (error) {
      console.error('Error in organization useEffect:', error);
    }
  }, [user, organizationError, organizationData]); // eslint-disable-line react-hooks/exhaustive-deps

  return loadingSettings && loadingOrganization;
};

export default useInit;
