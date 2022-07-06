import { RepeatClockIcon } from '@chakra-ui/icons';

import { AttachmentIcon, AuditIcon, DetailIcon, ProgressIcon, QuestionIcon, TeamsIcon } from '../icons';

export const toastSuccess: any = {
  title: 'Success',
  status: 'success',
  duration: 5000,
  isClosable: true,
  position: 'top',
};

export const toastFailed: any = {
  title: 'Failed',
  status: 'error',
  duration: 5000,
  isClosable: true,
  position: 'top',
};

export const actionStatuses = {
  inProgress: 'In progress',
  completed: 'Completed',
};

export const walkItemStatuses = {
  open: 'Open',
  closed: 'Closed',
};

export const actionsInsightsTypes = {
  total: 'Total',
  completed: 'Closed',
  inProgress: 'Open',
  overdue: 'Overdue',
};

export const auditsInsightsTypes = {
  total: 'Total',
  completed: 'Completed',
  upcoming: 'Upcoming',
  missed: 'Missed',
};

export const insightsCardsDotsPosition = {
  total: {
    top: '-25.2%',
    right: '-23.33%',
  },
  completed: {
    top: '-8.26%',
    right: '-25.56%',
  },
  upcoming: {
    top: '-38.26%',
    right: '24.95%',
  },
  missed: {
    top: '42.17%',
    right: '-21.1%',
  },
};

export const userMenus = [
  {
    label: 'Terms and Conditions',
    url: '/terms-and-conditions',
  },
  {
    label: 'Privacy Policy',
    url: '/privacy-policy',
  },
  {
    label: 'Help',
    url: '/help',
  },
  {
    label: 'Settings',
    url: '/admin/settings',
    permission: 'adminPanel.view',
  },
];

export const responseTabItems = [
  {
    index: 0,
    label: 'Details',
    icon: DetailIcon,
  },
  {
    index: 1,
    label: 'Attachments',
    icon: AttachmentIcon,
  },
  {
    index: 2,
    label: 'Questions',
    icon: QuestionIcon,
  },
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
  '#545775',
];

export const settingsTabs = [
  {
    index: 0,
    label: 'Defaults',
  },
  {
    index: 1,
    label: 'Email templates',
  },
  // {
  //   index: 2,
  //   label:"Notifications"
  // }
];

export const auditTabs = [
  {
    index: 0,
    label: 'All logs',
  },
  {
    index: 1,
    label: 'Renewals',
  },
  {
    index: 2,
    label: 'Team changes',
  },
];

export const navigationTabs = [
  {
    label: 'Progress',
    url: '',
    icon: ProgressIcon,
  },
  {
    label: 'Change log',
    url: '/change-log',
    icon: AuditIcon,
  },
  {
    label: 'Participants',
    url: '/participants',
    icon: TeamsIcon,
  },
  {
    label: 'Review history',
    url: '/history',
    icon: RepeatClockIcon,
  },
];

export const userRoles = [
  {
    value: 'responsible',
    label: 'Responsible',
  },
  {
    value: 'accountable',
    label: 'Accountable',
  },
  {
    value: 'contributor',
    label: 'Contributor',
  },
  {
    value: 'follower',
    label: 'Follower',
  },
];

export const auditUserRoles = [
  {
    value: 'auditor',
    label: 'Auditor',
  },
  {
    value: 'participant',
    label: 'Participant',
  },
];

export const actionUserRoles = [
  {
    value: 'assignee',
    label: 'Assignee',
  },
];

export const questionsUserRoles = [
  {
    value: 'addedBy',
    label: 'Added by',
  },
];

export const questionTypes = [
  {
    value: 'text',
    label: 'Text input',
  },
  {
    value: 'textMultiline',
    label: 'Multiple lines of text',
  },
  {
    value: 'switch',
    label: 'Yes / No answer',
  },
  {
    value: 'datepicker',
    label: 'Date input',
  },
  {
    value: 'multipleChoice',
    label: 'Multiple choices',
  },
  {
    value: 'url',
    label: 'URL',
  },
  // {
  //   value: "singleChoice",
  //   label: "Single choice"
  // },
  // {
  //   value: "email",
  //   label: "Email address"
  // },
  // {
  //   value: "phoneNumber",
  //   label: "Phone number"
  // },
  // {
  //   value: "numeric",
  //   label: "Numeric"
  // }
];

export const SwitchOptions = [
  {
    label: 'Yes',
    value: 'yes',
  },
  {
    label: 'No',
    value: 'no',
  },
];

export const priorities = [
  {
    value: 'low',
    label: 'Low',
  },
  {
    value: 'medium',
    label: 'Medium',
  },
  {
    value: 'high',
    label: 'High',
  },
];
