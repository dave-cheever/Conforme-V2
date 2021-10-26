import { useContext } from "react";
import { ChakraProvider, CSSReset, Flex, Spinner } from "@chakra-ui/react";
import { Route, Switch } from "react-router-dom";

import getTheme from "./theme";
import { IState, IStore, store } from "./store";
import useAuth from "../hooks/useAuth";
import useInit from "../hooks/useInit";
import useRoutes from "../hooks/useRoutes";
import IdleMonitor from "../components/IdleMonitor";

function App() {
  const { state }: IStore = useContext(store);
  const { user, organizationConfig }: IState = state;
  const loadingSettings = useInit();
  const { loading: loadingUser } = useAuth();
  const routes = useRoutes();

  if (loadingSettings || loadingUser) {
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
      <Switch>{routes.map(props => <Route {...props} />)}</Switch>
    </ChakraProvider>
  );
}

export default App;
