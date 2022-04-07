import { Redirect } from 'react-router-dom';

import Can from '../components/can';
import { useAppContext } from '../contexts/AppProvider';
import IRoute from '../interfaces/IRoute';
import AuditLayout from '../layouts/AuditLayout';
import DefaultLayout from '../layouts/DefaultLayout';
import FilterLayout from '../layouts/FilterLayout';
import PureLayout from '../layouts/PureLayout';
import ResponseLayout from '../layouts/ResponseLayout';
import Accidents from '../pages/accidents';
import Actions from '../pages/actions';
import Areas from '../pages/admin/areas';
import AuditLog from '../pages/admin/audit-log';
import AuditTypes from '../pages/admin/audit-types';
import BusinessUnits from '../pages/admin/business-units';
import Categories from '../pages/admin/categories';
import ComplianceItemsAdmin from '../pages/admin/compliance-items';
import Locations from '../pages/admin/locations';
import Questions from '../pages/admin/questions';
import QuestionsCategories from '../pages/admin/questions-categories';
import RegulatoryBodies from '../pages/admin/regulatory-bodies';
import Settings from '../pages/admin/settings';
import Sites from '../pages/admin/sites';
import Users from '../pages/admin/users';
import Assets from '../pages/assets';
import Audit from '../pages/audit';
import AuditParticipants from '../pages/audit/participants';
import Audits from '../pages/audits';
import ComplianceItemAuditLog from '../pages/compliance-item/audit-log';
import History from '../pages/compliance-item/history';
import ComplianceItemResponse from '../pages/compliance-item/index';
import Team from '../pages/compliance-item/team';
import Dashboard from '../pages/dashboard';
import Help from '../pages/help';
import Insights from '../pages/insights';
import Licenses from '../pages/licenses';
import Login from '../pages/login';
import Logout from '../pages/logout';
import Mentions from '../pages/mentions';
import PrivacyPolicy from '../pages/privacy-policy';
import Terms from '../pages/terms';

// Routes visible for not signed in
const openRoutes: Array<IRoute> = [
  {
    path: '/login',
    key: 'login',
    exact: true,
    component: Login,
    layout: PureLayout,
  },
  {
    path: '/logout',
    key: 'logout',
    exact: true,
    component: Logout,
    layout: PureLayout,
  },
  {
    path: '*',
    key: 'not-allowed',
    component: () => (
      <Redirect
        key="not-allowed"
        to={{
          pathname: '/login',
          state: { redirectUrl: window.location.pathname },
        }}
      />
    ),
    layout: PureLayout,
  },
];

// Routes visible for signed in, that accepted the Terms and Conditions
const protectedRoutes: Array<IRoute> = [
  {
    path: '/audits',
    key: 'audits',
    exact: true,
    component: Audits,
    layout: DefaultLayout,
  },
  {
    path: '/audits/:id',
    key: 'audit',
    exact: true,
    component: Audit,
    layout: AuditLayout,
  },
  {
    path: '/audits/:id/participants',
    key: 'audit',
    exact: true,
    component: AuditParticipants,
    layout: AuditLayout,
  },
  {
    path: '/',
    key: 'dashboard',
    exact: true,
    component: Dashboard,
    layout: FilterLayout,
  },
  {
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
    component: ComplianceItemAuditLog,
    layout: ResponseLayout,
  },
  {
    path: '/compliance-item/:id/team',
    key: 'complianceItem-team',
    exact: true,
    component: Team,
    layout: ResponseLayout,
  },
  {
    path: '/compliance-item/:id/history',
    key: 'complianceItem-history',
    exact: true,
    component: History,
    layout: ResponseLayout,
  },
  {
    path: '/insights',
    key: 'insights',
    exact: true,
    component: Insights,
    layout: DefaultLayout,
  },
  {
    path: '/licenses',
    key: 'licences',
    exact: true,
    component: Licenses,
    layout: DefaultLayout,
  },
  {
    path: '/assets',
    key: 'assets',
    exact: true,
    component: Assets,
    layout: DefaultLayout,
  },
  {
    path: '/actions',
    key: 'actions',
    exact: true,
    component: Actions,
    layout: DefaultLayout,
  },
  {
    path: '/accidents',
    key: 'accidents',
    exact: true,
    component: Accidents,
    layout: DefaultLayout,
  },
  {
    path: '/privacy-policy',
    key: 'privacy-policy',
    exact: true,
    component: PrivacyPolicy,
    layout: DefaultLayout,
  },
  {
    path: '/terms-and-conditions',
    key: 'terms',
    exact: true,
    component: Terms,
    layout: DefaultLayout,
  },
  {
    path: '/mentions',
    key: 'mentions',
    exact: true,
    component: Mentions,
    layout: DefaultLayout,
  },
  {
    path: '/admin/compliance-items',
    key: 'compliance-items-admin',
    exact: true,
    component: ComplianceItemsAdmin,
    layout: FilterLayout,
  },
  {
    path: '/admin/regulatory-bodies',
    key: 'regulatory-bodies',
    exact: true,
    component: RegulatoryBodies,
    layout: DefaultLayout,
  },
  {
    path: '/admin/categories',
    key: 'categories',
    exact: true,
    component: Categories,
    layout: DefaultLayout,
  },
  {
    path: '/admin/locations',
    key: 'locations',
    exact: true,
    component: Locations,
    layout: DefaultLayout,
  },
  {
    path: '/admin/sites',
    key: 'sites',
    exact: true,
    component: Sites,
    layout: DefaultLayout,
  },
  {
    path: '/admin/business-units',
    key: 'business-units',
    exact: true,
    component: BusinessUnits,
    layout: DefaultLayout,
  },
  {
    path: '/admin/areas',
    key: 'areas',
    exact: true,
    component: Areas,
    layout: DefaultLayout,
  },
  {
    path: '/admin/questions-categories',
    key: 'questionsCategories',
    exact: true,
    component: QuestionsCategories,
    layout: DefaultLayout,
  },
  {
    path: '/admin/questions',
    key: 'questions',
    exact: true,
    component: Questions,
    layout: DefaultLayout,
  },
  {
    path: '/admin/audit-types',
    key: 'audit-types',
    exact: true,
    component: AuditTypes,
    layout: DefaultLayout,
  },
  {
    path: '/admin/users',
    key: 'users',
    exact: true,
    component: Users,
    layout: DefaultLayout,
  },
  {
    path: '/admin/audit-log',
    key: 'audit-log',
    exact: true,
    component: AuditLog,
    layout: DefaultLayout,
  },
  {
    path: '/admin/settings',
    key: 'settings',
    exact: true,
    component: Settings,
    layout: DefaultLayout,
  },
  {
    path: '/help',
    key: 'help',
    exact: true,
    component: Help,
    layout: DefaultLayout,
  },
  {
    path: '*',
    key: 'not-found',
    component: () => <Redirect key="not-found" to={{ pathname: '/' }} />,
    layout: DefaultLayout,
  },
];

const useRoutes = () => {
  const { user } = useAppContext();

  let routes: IRoute[] = [];
  if (!user) routes = openRoutes;
  else routes = protectedRoutes;

  return routes.map((route) => ({
    ...route,
    component: () => (
      <Can
        action={route.permission}
        no={() => <Redirect key="not-found" to={{ pathname: '/' }} />}
        yes={() => <route.layout component={route.component} key={route.key} />}
      />
    ),
  }));
};

export default useRoutes;
