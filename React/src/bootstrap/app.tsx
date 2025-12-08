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
import { isProtectedRoute } from './protectedRoutes';
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
  
  // Helper function to check if user and module are ready
  const isUserReady = (currentUser: typeof user, isLoadingUser: boolean, isLoadingSettings: boolean, currentModule: typeof module) => {
    return !!(currentUser && !isLoadingUser && !isLoadingSettings && currentModule);
  };
  
  // Helper function to calculate route states
  const getRouteStates = (pathname: string, currentModule: typeof module) => {
    return {
      isFromLogin: pathname === '/login' || pathname.endsWith('/login'),
      isOnLogout: pathname === '/logout' || pathname.endsWith('/logout'),
      isOnModuleRoot: pathname === `/${currentModule?.path}` || pathname === '/',
      isOnOverview: pathname === '/overview',
    };
  };
  
  // Helper function to check if on a valid protected route
  const isOnValidProtectedRoute = (
    pathname: string,
    routeStates: ReturnType<typeof getRouteStates>,
    currentModule: typeof module
  ) => {
    if (routeStates.isFromLogin || routeStates.isOnLogout || routeStates.isOnOverview || routeStates.isOnModuleRoot) {
      return false;
    }
    if (pathname === '/') {
      return false;
    }
    const pathSegments = pathname.split('/').filter(Boolean);
    const hasAdditionalPathSegments = pathSegments.length > (currentModule?.path ? 1 : 0);
    return isProtectedRoute(pathname) || hasAdditionalPathSegments;
  };
  
  // Helper function to handle redirect to login scenario
  const handleRedirectToLogin = (
    isRedirecting: boolean,
    routeStates: ReturnType<typeof getRouteStates>,
    navigate: typeof navigateTo
  ) => {
    if (!isRedirecting) {
      return false;
    }
    if (!routeStates.isFromLogin && !routeStates.isOnLogout) {
      navigate('/login');
    }
    return true;
  };
  
  // Helper function to handle redirect to overview
  const handleRedirectToOverview = (
    routeStates: ReturnType<typeof getRouteStates>,
    currentUser: typeof user,
    redirectFlag: React.MutableRefObject<boolean>,
    navigate: typeof navigateTo
  ) => {
    if (routeStates.isOnLogout) {
      return;
    }
    
    // Reset the flag when on login page with a logged-in user
    if (routeStates.isFromLogin && currentUser && redirectFlag.current) {
      redirectFlag.current = false;
    }
    
    const shouldRedirectFromLogin = routeStates.isFromLogin && !redirectFlag.current;
    const shouldRedirectFromModuleRoot = routeStates.isOnModuleRoot && !redirectFlag.current && !routeStates.isOnOverview;
    
    if (shouldRedirectFromLogin || shouldRedirectFromModuleRoot) {
      redirectFlag.current = true;
      navigate('/overview');
    }
  };
 
  useEffect(() => {
    // CRITICAL: Early return for admin routes - never redirect from admin pages
    if (location.pathname.includes('/admin/')) {
      return;
    }

    // Don't run redirect logic if user/module isn't loaded yet
    if (!isUserReady(user, loadingUser, loadingSettings, module)) {
      return;
    }

    const routeStates = getRouteStates(location.pathname, module);
    const isRedirectingToLogin = sessionStorage.getItem('isRedirectingToLogin') === 'true';
    
    // Handle redirect to login scenario
    if (handleRedirectToLogin(isRedirectingToLogin, routeStates, navigateTo)) {
      return;
    }
    
    // Never redirect if we're already on a valid route
    if (isOnValidProtectedRoute(location.pathname, routeStates, module)) {
      return;
    }
    
    // Handle redirect to overview
    handleRedirectToOverview(routeStates, user, hasRedirectedAfterLogin, navigateTo);
    
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
