import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { ChakraProvider, CSSReset, Flex, Spinner } from '@chakra-ui/react';

import AdminProvider from '../contexts/AdminProvider';
import AppProvider, { useAppContext } from '../contexts/AppProvider';
import ConfigProvider from '../contexts/ConfigProvider';
import FiltersProvider from '../contexts/FiltersProvider';
import useAuth from '../hooks/useAuth';
import useInit from '../hooks/useInit';
import useNavigate from '../hooks/useNavigate';
import useRoutes from '../hooks/useRoutes';
import './styles.css';
import getTheme from './theme';
import { runtimeEnv } from '../utils/runtime-env';

function App() {
  const { user, organizationConfig, module } = useAppContext();
  const loadingSettings = useInit();
  const loadingUser = useAuth();
  const routes = useRoutes();
  const { navigate } = useNavigate();
  const location = useLocation();
  // Set cookie with client URL for auth flow
  const clientUrl = runtimeEnv.clientUrl() || '';
  const clientDomain = new URL(clientUrl).hostname;
  const domainParts = clientDomain.split('.');
  const topLevelDomain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : clientDomain;
  document.cookie = `clientUrl=${clientUrl}; path=/; SameSite=None; Secure; Domain=.${topLevelDomain}`;
 
  useEffect(() => {
    const isFromLogin = location.pathname === '/login';
    if (user && isFromLogin && Array.isArray(user.defaultPage) && user.defaultPage.length > 0) {
      const defaultPage = user.defaultPage.find((value) => value.name === module?.name);
      const defaultPath = defaultPage?.path;
      if (defaultPath === '/') navigate(defaultPath);
      else navigate(`${defaultPath}`);
    }
  }, [user, location.pathname]);

  if (user === undefined || loadingSettings || loadingUser) {
    return (
      <ChakraProvider data-id="000018" theme={getTheme(organizationConfig?.theme)}>
        <Flex alignItems="center" data-id="000019" h="100vh" justifyContent="center" w="100vw">
          <Spinner color="brand.primary" data-id="000020" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider data-id="000021" theme={getTheme(organizationConfig?.theme)}>
      <CSSReset data-id="000022" />
      <AdminProvider data-id="000023">
        <FiltersProvider data-id="000024">
          <Routes data-id="000025">
            {routes.map((props) => (
              <Route data-id="000026" {...props} key={props.path} />
            ))}
          </Routes>
        </FiltersProvider>
      </AdminProvider>
    </ChakraProvider>
  );
}

function AppWithContext() {
  return (
    <AppProvider data-id="000027">
      <ConfigProvider data-id="000028">
        <App data-id="000029" />
      </ConfigProvider>
    </AppProvider>
  );
}

export default AppWithContext;
