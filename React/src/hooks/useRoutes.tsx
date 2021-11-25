import { Redirect } from "react-router-dom";

import Login from "../pages/login";
import Can from "../components/can";
import Audits from "../pages/audits";
import Licenses from "../pages/licenses";
import Assets from "../pages/assets";
import Actions from "../pages/actions";
import Accidents from "../pages/accidents";
import Policies from "../pages/policies";
import Mentions from "../pages/mentions";
import ComplianceItems from "../pages/compliance-items";
import ComplianceItemsAdmin from "../pages/admin/compliance-items";
import Categories from "../pages/admin/categories";
import RegulatoryBodies from "../pages/admin/regulatory-bodies";
import FunctionalAreas from "../pages/admin/functional-areas";
import BusinessUnits from "../pages/admin/business-units";
import Users from "../pages/admin/users";
import AuditLog from "../pages/admin/audit-log";
import Settings from "../pages/admin/settings";
import DefaultLayout from "../layouts/DefaultLayout";
import PureLayout from "../layouts/PureLayout";
import IRoute from "../interfaces/IRoute";
import { useAppContext } from "../contexts/AppProvider";
import ComplianceItemResponse from "../pages/compliance-item/index";
import Insights from "../pages/insights";
import Help from "../pages/help";
import FilterLayout from "../layouts/FilterLayout";
import ResponseLayout from "../layouts/ResponseLayout";
import Team from "../pages/compliance-item/team";

// Routes visible for not signed in
const openRoutes: Array<IRoute> = [
  {
    path: "/login",
    key: "login",
    exact: true,
    component: Login,
    layout: PureLayout,
  },
  {
    path: "*",
    key: "not-allowed",
    component: () => <Redirect key="not-allowed" to={{ pathname: "/login" }} />,
    layout: PureLayout,
  },
];

// Routes visible for signed in, that accepted the Terms and Conditions
const protectedRoutes: Array<IRoute> = [
  {
    path: "/audits",
    key: "audits",
    exact: true,
    component: Audits,
    layout: DefaultLayout,
  },
  {
    path: "/",
    key: "home",
    exact: true,
    component: ComplianceItems,
    layout: FilterLayout,
  }, {
    path: '/compliance-item/:id',
    key: 'complianceItem',
    exact: true,
    component: ComplianceItemResponse,
    layout: ResponseLayout,
  },
  {
    path: '/compliance-item/:id/audit-log',
    key: 'complianceItem-audit',
    exact: true,
    component: AuditLog,
    layout: ResponseLayout,
  },
  {
    path: '/compliance-item/:id/team',
    key: 'complianceItem-team',
    exact: true,
    component: Team,
    layout: ResponseLayout,
  }, {
    path: '/insights',
    key: 'insights',
    exact: true,
    component: Insights,
    layout: DefaultLayout,
  }, {
    path: "/licenses",
    key: "licences",
    exact: true,
    component: Licenses,
    layout: DefaultLayout,
  },
  {
    path: "/assets",
    key: "assets",
    exact: true,
    component: Assets,
    layout: DefaultLayout,
  },
  {
    path: "/actions",
    key: "actions",
    exact: true,
    component: Actions,
    layout: DefaultLayout,
  },
  {
    path: "/accidents",
    key: "accidents",
    exact: true,
    component: Accidents,
    layout: DefaultLayout,
  },
  {
    path: "/policies",
    key: "policies",
    exact: true,
    component: Policies,
    layout: DefaultLayout,
  },
  {
    path: "/mentions",
    key: "mentions",
    exact: true,
    component: Mentions,
    layout: DefaultLayout,
  },
  {
    path: "/admin/compliance-items",
    key: "compliance-items-admin",
    exact: true,
    component: ComplianceItemsAdmin,
    layout: DefaultLayout,
  },
  {
    path: "/admin/regulatory-bodies",
    key: "regulatory-bodies",
    exact: true,
    component: RegulatoryBodies,
    layout: DefaultLayout,
  },
  {
    path: "/admin/categories",
    key: "categories",
    exact: true,
    component: Categories,
    layout: DefaultLayout,
  },
  {
    path: "/admin/functional-areas",
    key: "functional-areas",
    exact: true,
    component: FunctionalAreas,
    layout: DefaultLayout,
  },
  {
    path: "/admin/business-units",
    key: "business-units",
    exact: true,
    component: BusinessUnits,
    layout: DefaultLayout,
  },
  {
    path: "/admin/users",
    key: "users",
    exact: true,
    component: Users,
    layout: DefaultLayout,
  },
  {
    path: "/admin/audit-log",
    key: "audit-log",
    exact: true,
    component: AuditLog,
    layout: DefaultLayout,
  },
  {
    path: "/admin/settings",
    key: "settings",
    exact: true,
    component: Settings,
    layout: DefaultLayout,
  },
  {
    path: '/help',
    key: "help",
    exact: true,
    component: Help,
    layout: DefaultLayout,
  },
  {
    path: "*",
    key: "not-found",
    component: () => <Redirect key="not-found" to={{ pathname: "/" }} />,
    layout: DefaultLayout,
  },
];

const useRoutes = () => {
  const { user } = useAppContext();

  let routes: IRoute[] = [];
  if (!user) {
    routes = openRoutes;
  } else {
    routes = protectedRoutes;
  }

  return routes.map(route => ({
    ...route,
    component: () => (
      <Can
        action={route.permission}
        yes={() => <route.layout key={route.key} component={route.component} />}
        no={() => <Redirect key="not-found" to={{ pathname: "/" }} />}
      />
    ),
  }));
};

export default useRoutes;
