import { useEffect, useRef } from 'react';
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
import { runtimeEnv } from '../utils/runtime-env';
import getTheme from './theme';

function App() {
  const { user, organizationConfig, module } = useAppContext();
  const loadingSettings = useInit();
  const loadingUser = useAuth();
  const routes = useRoutes();
  const { navigateTo } = useNavigate();
  const location = useLocation();
  const hasRedirectedAfterLogin = useRef(false);
  
  // Set cookie with client URL for auth flow
  const clientUrl = runtimeEnv.clientUrl() || '';
  const clientDomain = new URL(clientUrl).hostname;
  const domainParts = clientDomain.split('.');
  const topLevelDomain = domainParts.length >= 2 ? domainParts.slice(-2).join('.') : clientDomain;
  document.cookie = `clientUrl=${clientUrl}; path=/; SameSite=None; Secure; Domain=.${topLevelDomain}`;
 
  useEffect(() => {
    const isFromLogin = location.pathname === '/login' || location.pathname.endsWith('/login');
    const isOnLogout = location.pathname === '/logout' || location.pathname.endsWith('/logout');
    const isOnModuleRoot = location.pathname === `/${module?.path}` || location.pathname === '/';
    
    // Redirect to overview only when coming from login page or landing on root after login
    if (user && !loadingUser && !loadingSettings && module && !isOnLogout) {
      if ((isFromLogin || isOnModuleRoot) && !hasRedirectedAfterLogin.current) {
        // Only redirect if we haven't redirected yet (initial load after login)
        hasRedirectedAfterLogin.current = true;
        navigateTo('/overview');
      }
    }
    
    // Reset the flag when user logs out
    if (!user) {
      hasRedirectedAfterLogin.current = false;
    }
  }, [user, location.pathname, module, navigateTo, loadingUser, loadingSettings]);

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
