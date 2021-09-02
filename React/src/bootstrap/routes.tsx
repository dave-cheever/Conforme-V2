import { Redirect } from "react-router-dom";

import User from "../models/user";
import Home from "../pages/home";
import Login from "../pages/login";
import Can from "../components/can";
import Audits from "../pages/audits";
import Licenses from "../pages/licenses";
import Assets from "../pages/assets";
import Actions from "../pages/actions";
import Accidents from "../pages/accidents";
import Policies from "../pages/policies";
import Mentions from "../pages/mentions";
import ComplianceItems from "../pages/complianceItems";
import ComplianceItemsAdmin from "../pages/admin/complianceItemsAdmin";
import Categories from "../pages/admin/categories";
import RegulatoryBodies from "../pages/admin/regulatory-bodies";
import FunctionalAreas from "../pages/admin/functional-areas";
import BusinessUnits from "../pages/admin/business-units";
import Users from "../pages/admin/users";
import AuditLog from "../pages/admin/audit-log";
import Settings from "../pages/admin/settings";

export interface IRoute {
  path: string;
  key: string;
  exact?: boolean;
  component: (props?: any) => JSX.Element;
  permission?: string;
}

// Routes visible for not signed in
const openRoutes: Array<IRoute> = [
  {
    path: "/login",
    key: "login",
    exact: true,
    component: Login,
  },
  {
    path: "*",
    key: "not-allowed",
    component: () => <Redirect key="not-allowed" to={{ pathname: "/login" }} />,
  },
];

// Routes visible for signed in, that accepted the Terms and Conditions
const protectedRoutes: Array<IRoute> = [
  {
    path: "/",
    key: "home",
    exact: true,
    component: Home,
  },
  {
    path: "/audits",
    key: "audits",
    exact: true,
    component: Audits,
  },
  {
    path: "/compliance-items",
    key: "compliance-items",
    exact: true,
    component: ComplianceItems,
  },
  {
    path: "/licenses",
    key: "licences",
    exact: true,
    component: Licenses,
  },
  {
    path: "/assets",
    key: "assets",
    exact: true,
    component: Assets,
  },
  {
    path: "/actions",
    key: "actions",
    exact: true,
    component: Actions,
  },
  {
    path: "/accidents",
    key: "accidents",
    exact: true,
    component: Accidents,
  },
  {
    path: "/policies",
    key: "policies",
    exact: true,
    component: Policies,
  },
  {
    path: "/mentions",
    key: "mentions",
    exact: true,
    component: Mentions,
  },
  {
    path: "/admin/compliance-items",
    key: "compliance-items-admin",
    exact: true,
    component: ComplianceItemsAdmin,
  },
  {
    path: "/admin/regulatory-bodies",
    key: "regulatory-bodies",
    exact: true,
    component: RegulatoryBodies,
  },
  {
    path: "/admin/categories",
    key: "categories",
    exact: true,
    component: Categories,
  },
  {
    path: "/admin/functional-areas",
    key: "functional-areas",
    exact: true,
    component: FunctionalAreas,
  },
  {
    path: "/admin/business-units",
    key: "business-units",
    exact: true,
    component: BusinessUnits,
  },
  {
    path: "/admin/users",
    key: "users",
    exact: true,
    component: Users,
  },
  {
    path: "/admin/audit-log",
    key: "audit-log",
    exact: true,
    component: AuditLog,
  },
  {
    path: "/admin/settings",
    key: "settings",
    exact: true,
    component: Settings,
  },
  {
    path: "*",
    key: "not-found",
    component: () => <Redirect key="not-found" to={{ pathname: "/" }} />,
  },
];

export const getRoutes = (user: User) => {
  let routes: IRoute[];
  if (!user) {
    routes = openRoutes;
  } else {
    routes = protectedRoutes;
  }

  return routes.map((route) => ({
    ...route,
    component: () => (
      <Can
        action={route.permission}
        yes={route.component}
        no={() => <Redirect key="not-found" to={{ pathname: "/" }} />}
      />
    ),
  }));
};
