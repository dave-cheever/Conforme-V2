import { useEffect } from "react";
import { ChakraProvider, CSSReset, Flex, Spinner } from "@chakra-ui/react";
import { Route, Switch, useHistory } from "react-router-dom";

import './styles.css';
import getTheme from "./theme";
import useAuth from "../hooks/useAuth";
import useInit from "../hooks/useInit";
import useRoutes from "../hooks/useRoutes";
import IdleMonitor from "../components/IdleMonitor";
import AppProvider, { useAppContext } from "../contexts/AppProvider";
import AdminProvider from "../contexts/AdminProvider";
import FiltersProvider from "../contexts/FiltersProvider";

function App() {
  const { user, organizationConfig } = useAppContext();
  const loadingSettings = useInit();
  const loadingUser = useAuth();
  const routes = useRoutes();
  const history = useHistory();

  useEffect(() => {
    const redirectUrl = localStorage.getItem('redirectUrl');
    
    if(redirectUrl){
      localStorage.removeItem('redirectUrl');
      history.push(redirectUrl);
    }
  // eslint-disable-next-line
  },[]);

  if (user === undefined || loadingSettings || loadingUser) {
    return (
      <ChakraProvider theme={getTheme(organizationConfig?.theme)}>
        <Flex w="100vw" h="100vh" alignItems="center" justifyContent="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.primary"
            size="xl"
          />
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
          <Switch>{routes.map(props => <Route {...props} />)}</Switch>
        </FiltersProvider>
      </AdminProvider>
    </ChakraProvider>
  );
}

const AppWithContext = () => <AppProvider><App /></AppProvider>;

export default AppWithContext;
