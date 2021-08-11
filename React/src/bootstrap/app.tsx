import { useContext, useEffect, useState } from "react";
import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import { Route, Switch } from "react-router-dom";

import getTheme from "./theme";
import { getRoutes, IRoute } from "./routes";
import { IState, IStore, store } from "./store";
import Layout from "./layout";

declare global {
  var roles: {
    reader: {
      normal: string[];
      restricted: string[];
    };
    systemAdmin: {
      normal: string[];
      restricted: string[];
    };
    user: {
      normal: string[];
      restricted: string[];
    };
  };
}

function App() {
  const { state }: IStore = useContext(store);
  const { user, organizationConfig }: IState = state;
  const [routes, setRoutes] = useState<IRoute[]>([]);

  globalThis.roles = {
    reader: {
      normal: [],
      restricted: [],
    },
    systemAdmin: {
      normal: [],
      restricted: [],
    },
    user: {
      normal: [],
      restricted: [],
    },
  };

  useEffect(() => {
    const routes = getRoutes(user);
    setRoutes(routes);
  }, [user]);

  useEffect(() => {
    const getOrganizationTheme = async () => {
      document.title = `Conforme - ${organizationConfig?.name}`;
    };
    getOrganizationTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRoute = ({ key, path, exact, component }: IRoute) => {
    return (
      <Route key={key} exact={exact} path={path}>
        <Layout component={component} />
      </Route>
    );
  };

  return (
    <ChakraProvider theme={getTheme(organizationConfig?.theme)}>
      <CSSReset />
      <Switch>{routes.map((route) => renderRoute(route))}</Switch>
    </ChakraProvider>
  );
}

export default App;
