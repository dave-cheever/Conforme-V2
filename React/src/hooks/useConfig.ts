import { RepeatClockIcon } from '@chakra-ui/icons';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { Admin, CalendarIcon, Home, Insights, ListIcon, ProgressIcon, TeamsIcon } from '../icons';
import { INavItem } from '../interfaces/INavItem';

const useConfig = () => {
  const auditsMenuItems: INavItem[] = [
    {
      type: 'menuItem',
      label: pluralize(t('audit')),
      url: '/dashboard',
      icon: Home,
      permission: 'home.view',
    },
    {
      type: 'menuItem',
      label: 'Actions',
      url: '/actions',
      icon: CalendarIcon,
      permission: 'actions.view',
    },
    {
      type: 'menuItem',
      label: pluralize(t('question')),
      url: '/walk-items',
      icon: ListIcon,
      permission: 'actions.view',
    },
    {
      type: 'menuItem',
      label: 'Insights',
      url: '/insights',
      icon: Insights,
      permission: 'insights.view',
    },
    {
      type: 'menuItem',
      label: 'Admin',
      url: '/admin',
      icon: Admin,
      permission: 'adminPanel.view',
      subSections: [
        { label: 'Sites', url: '/admin/sites' },
        { label: 'Areas', url: '/admin/areas' },
        { label: 'Questions', url: '/admin/questions', permission: 'adminPanel.questions' },
        { label: 'Questions categories', url: '/admin/questions-categories', permission: 'adminPanel.questionsCategories' },
        { label: 'Audit types', url: '/admin/audit-types', permission: 'adminPanel.auditTypes' },
        { label: 'Users', url: '/admin/users' },
        { label: 'Audit log', url: '/admin/audit-log' },
        { label: 'Other settings', url: '/admin/settings' },
      ],
    },
  ];

  const auditNavigationTabs = [
    {
      label: capitalize(pluralize(t('audit'))),
      url: '/',
      icon: ProgressIcon,
    },
    {
      label: 'Participants',
      url: '/participants',
      icon: TeamsIcon,
    },
    {
      label: 'History',
      url: '/history',
      icon: RepeatClockIcon,
    },
  ];

  return { auditsMenuItems, auditNavigationTabs };
};

export default useConfig;
