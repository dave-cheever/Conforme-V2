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

function App() {
  const { user, organizationConfig, module} = useAppContext();
  const loadingSettings = useInit();
  const loadingUser = useAuth();
  const routes = useRoutes();
  const { navigate } = useNavigate();
  const location = useLocation();
  // Set cookie with client URL for auth flow
  document.cookie = `clientUrl=${process.env.REACT_APP_CLIENT_URL}; path=/; SameSite=None; Secure; Domain=.conforme-sit.app`;
  useEffect(() => {
    const isFromLogin = location.pathname === '/login';
    if (user && isFromLogin && Array.isArray(user.defaultPage) && user.defaultPage.length > 0) {
      const defaultPage = user.defaultPage.find((value) => value.name === module?.name);
      const defaultPath = defaultPage?.path;
      if (defaultPath === "/") 
        navigate(defaultPath);
       else 
        navigate(`${defaultPath}`);
    }
  }, [user, location.pathname]);

  if (user === undefined || loadingSettings || loadingUser) {
    return (
      <ChakraProvider data-id="8bb923075c38" theme={getTheme(organizationConfig?.theme)}>
        <Flex alignItems="center" data-id="33d5cdd6386a" h="100vh" justifyContent="center" w="100vw">
          <Spinner color="brand.primary" data-id="db2f2811922f" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider data-id="ba8f0b72a649" theme={getTheme(organizationConfig?.theme)}>
      <CSSReset data-id="98971139de59" />
      {/* {user && <IdleMonitor data-id="70d9b5aff63a" />} */}
      <AdminProvider data-id="3936a5fd8325">
        <FiltersProvider data-id="c63426c7a6be">
          <Routes data-id="f7c0226baff0">
            {routes.map((props) => (
              <Route data-id="bb5c7c440edc" {...props} key={props.path} />
            ))}
          </Routes>
        </FiltersProvider>
      </AdminProvider>
    </ChakraProvider>
  );
}

function AppWithContext() {
  return (
    <AppProvider data-id="1485cd05cde6">
      <ConfigProvider data-id="f93a4ac1fd0d">
        <App data-id="59ebca745f27" />
      </ConfigProvider>
    </AppProvider>
  );
}

export default AppWithContext;
