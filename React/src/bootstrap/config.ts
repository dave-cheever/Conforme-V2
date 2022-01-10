import {
  Admin,
  AttachmentIcon,
  AuditIcon,
  DetailIcon,
  Home,
  // Insights,
  ProgressIcon,
  QuestionIcon,
  TeamsIcon
} from "../icons";
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
    label: "Compliance items",
    url: "/",
    icon: Home,
    permission: "home.view"
  }, {
  //   type: "menuItem",
  //   label: "Insights",
  //   url: "/insights",
  //   icon: Insights,
  //   permission: "insights.view"
  // }, {
    type: "menuItem",
    label: "Admin",
    url: "/admin",
    icon: Admin,
    permission: "adminPanel.view",
    subSections: [
      { label: "Compliance items", url: "/admin/compliance-items" },
      { label: "Regulatory bodies", url: "/admin/regulatory-bodies" },
      { label: "Categories", url: "/admin/categories" },
      { label: "Locations", url: "/admin/locations" },
      { label: "Business units", url: "/admin/business-units" },
      { label: "Users", url: "/admin/users" },
      { label: "Audit log", url: "/admin/audit-log" },
      { label: "Other settings", url: "/admin/settings" },
    ]
  },
];


export const userMenus = [
  {
    label: "Terms and Conditions",
    url: "/terms-and-conditions"
  },
  {
    label: "Privacy Policy",
    url: "/privacy-policy"
  },
  {
    label: "Help",
    url: "/help"
  },
  {
    label: "Settings",
    url: "/admin/settings"
  }
];

export const responseTabItems = [
  {
    index:0,
    label:"Details",
    icon: DetailIcon
  },
  { 
    index:1,
    label: "Attachments",
    icon: AttachmentIcon
  },
  {
    index:2,
    label:"Questions",
    icon: QuestionIcon
  }
]

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


export const settingsTabs = [
  {
    index: 0,
    label: "Defaults"
  },
  {
    index: 1,
    label: "Email templates"
  },
  {
    index: 2,
    label:"Notifications"
  }
];

export const navigationTabs = [
  {
    label: 'Progress',
    url: '',
    icon: ProgressIcon
  },
  {
    label: 'Audit log',
    url: '/audit-log',
    icon: AuditIcon
  },
  {
    label: 'Team',
    url: '/team',
    icon: TeamsIcon
  }
];

export const defaultPages = [{
  name: "Home Page",
  url: "/"
},
{
  name: "Admin Page",
  url: "/admin/compliance-items"
},
{
  name:"Insight Page",
  url: "/insights"
}
]