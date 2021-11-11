import {
  Dashboard,
  Accidents,
  Assets,
  Audits,
  Licenses,
  Mentions,
  Policies,
  Actions,
  Admin
} from "../icons";
import IFilters from "../interfaces/IFilters";
import { INavItem } from "../interfaces/INavItem";

export const toastSuccess: any = {
  title: "Success",
  status: "success",
  duration: 5000,
  isClosable: true,
  position: "top",
};

export const toastFailed: any = {
  title: "Failed",
  status: "error",
  duration: 5000,
  isClosable: true,
  position: "top",
};

export const menuItems: INavItem[] = [
  {
    type: "menuItem",
    label: "Dashboard",
    url: "/",
    icon: Dashboard,
  },
  {
    type: "menuItem",
    label: "Audits",
    url: "/audits",
    icon: Audits,
  },
  {
    type: "menuItem",
    label: "Compliance items",
    url: "/compliance-items",
    icon: Audits,
  },
  {
    type: "menuItem",
    label: "Licenses",
    url: "/licenses",
    icon: Licenses,
  },
  {
    type: "menuItem",
    label: "Assets",
    url: "/assets",
    icon: Assets,
  },
  {
    type: "menuItem",
    label: "Actions",
    url: "/actions",
    icon: Actions,
  },
  {
    type: "menuItem",
    label: "Accident Investigation",
    url: "/accidents",
    icon: Accidents,
  },
  {
    type: "menuItem",
    label: "Policies",
    url: "/policies",
    icon: Policies,
  },
  {
    type: "menuItem",
    label: "Admin",
    url: "/admin",
    icon: Admin,
    subSections: [
      { label: "Compliance items", url: "/admin/compliance-items" },
      { label: "Regulatory bodies", url: "/admin/regulatory-bodies" },
      { label: "Categories", url: "/admin/categories" },
      { label: "Functional areas", url: "/admin/functional-areas" },
      { label: "Business units", url: "/admin/business-units" },
      { label: "Users", url: "/admin/users" },
      { label: "Audit log", url: "/admin/audit-log" },
      { label: "Other settings", url: "/admin/settings" },
    ]
  },
  {
    type: "seperator",
    label: "CHAT",
  },
  {
    type: "mentions",
    label: "Mentions",
    url: "/mentions",
    icon: Mentions,
  }
];

export const chartColors = [
  '#336699',
  '#99CCFF',
  '#999933',
  '#666699',
  '#CC9933',
  '#006666',
  '#3399FF',
  '#993300',
  '#CCCC99',
  '#666666',
  '#FFCC66',
  '#6699CC',
  '#663366',
  '#9999CC',
  '#CCCCCC',
  '#669999',
  '#CCCC66',
  '#CC6600',
  '#9999FF',
  '#0066CC',
  '#99CCCC',
  '#999999',
  '#FFCC00',
  '#009999',
  '#99CC33',
  '#FF9900',
  '#999966',
  '#66CCCC',
  '#339966',
  '#CCCC33',
  '#003f5c',
  '#665191',
  '#a05195',
  '#d45087',
  '#2f4b7c',
  '#f95d6a',
  '#ff7c43',
  '#ffa600',
  '#EF6F6C',
  '#465775',
  '#56E39F',
  '#59C9A5',
  '#5B6C5D',
  '#0A2342',
  '#2CA58D',
  '#84BC9C',
  '#CBA328',
  '#F46197',
  '#DBCFB0',
  '#545775'
];

export const responseStatuses = {
  "completed": "Completed",
  "notStarted": "Not started",
  "inProgress": "In progress",
  "comingUp": "Coming up",
  "overdue": "Overdue",
  "noDueDate": "No due date",
  "all": "All",
  "compliant": "Compliant",
  "nonCompliant": "Non-compliant"
};

export const initialFilters: IFilters = {
  complianceItems: {
    name: 'Compliance item(s)',
    value: [],
  },
  category: {
    name: 'Category',
    value: [],
  },
  functionalAreas: {
    name: 'Functional area(s)',
    value: [],
  },
  businessUnits: {
    name: 'Business unit(s)',
    value: [],
  },
  itemStatus: {
    name: 'Item status',
    value: [],
  },
  regulatoryBody: {
    name: 'Regulatory body',
    value: [],
  },
  dueDate: {
    name: 'Due date',
    value: null,
  },
  isVerified: {
    name: 'Verified',
    value: null,
  },
  userRole: {
    name: 'User role',
    value: [],
  },
  collection: {
    name: 'Data type',
    value: []
  },
  action: {
    name: 'Action',
    value: []
  },
  users: {
    name: 'Users',
    value: [],
  },
};

export const complianceItemFrequencies = [
  "Monthly",
  "Quarterly",
  "6 months",
  "Annual",
  "2 years",
  "3 years",
  "5 years",
  "Variable",
  "Ad-hoc"
];
