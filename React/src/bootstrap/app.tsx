import { useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import { ChakraProvider, CSSReset, Flex, Spinner } from '@chakra-ui/react';

import './styles.css';
import IdleMonitor from '../components/IdleMonitor';
import AdminProvider from '../contexts/AdminProvider';
import AppProvider, { useAppContext } from '../contexts/AppProvider';
import ConfigProvider from '../contexts/ConfigProvider';
import FiltersProvider from '../contexts/FiltersProvider';
import useAuth from '../hooks/useAuth';
import useInit from '../hooks/useInit';
import useRoutes from '../hooks/useRoutes';
import getTheme from './theme';

function App() {
  const { user, organizationConfig } = useAppContext();
  const loadingSettings = useInit();
  const loadingUser = useAuth();
  const routes = useRoutes();
  const history = useHistory();

  useEffect(() => {
    const redirectUrl = localStorage.getItem('redirectUrl');

    if (redirectUrl) {
      localStorage.removeItem('redirectUrl');
      history.push(redirectUrl);
    }
  }, []);

  if (user === undefined || loadingSettings || loadingUser) {
    return (
      <ChakraProvider theme={getTheme(organizationConfig?.theme)}>
        <Flex alignItems="center" h="100vh" justifyContent="center" w="100vw">
          <Spinner color="brand.primary" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
        </Flex>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={getTheme(organizationConfig?.theme)}>
      <CSSReset />
      {user && <IdleMonitor />}
      <AdminProvider>
        <FiltersProvider>
          <Switch>
            {routes.map((props) => (
              <Route {...props} />
            ))}
          </Switch>
        </FiltersProvider>
      </AdminProvider>
    </ChakraProvider>
  );
}

const AppWithContext = () => (
  <AppProvider>
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </AppProvider>
);

export default AppWithContext;
