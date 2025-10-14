import { QuestionOutlineIcon, RepeatClockIcon } from '@chakra-ui/icons';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import {
  Admin,
  BlankPage,
  CategoryIcon,
  CheckIcon,
  EditIcon,
  GridIcon,
  HelpSupportIcon,
  Home,
  Insights,
  ListIcon,
  LocationIcon,
  ObservationEye,
  RegulatoryBodyIcon,
  SiteIcon,
  TeamsIcon,
} from '../icons';
import IFilters from '../interfaces/IFilters';
import { INavItem } from '../interfaces/INavItem';
import { ISearchCategory } from '../interfaces/ISearchCategory';
import runtimeEnv from '../utils/runtime-env';

const useConfig = () => {
  const auditSearchItems: ISearchCategory[] = [
    {
      type: 'audits',
      label: capitalize(pluralize(t('audit'))),
      icon: Home,
      url: '/audits',
    },
    {
      type: 'actions',
      label: 'Actions',
      icon: CheckIcon,
      url: '/actions',
    },
  ];

  const trackerSearchItems: ISearchCategory[] = [
    {
      type: 'tracker-item-response',
      label: capitalize(pluralize(t('tracker item'))),
      icon: Home,
      url: '/tracker/tracker-item',
    },
  ];

  const auditsMenuItems: INavItem[] = [
    {
      type: 'menuItem',
      label: capitalize(pluralize(t('audit'))),
      url: '/dashboard',
      icon: Home,
      permission: 'home.view',
    },
    {
      type: 'menuItem',
      label: capitalize(pluralize(t('answer'))),
      url: '/answers',
      icon: ObservationEye,
      permission: 'answers.view',
    },
    {
      type: 'menuItem',
      label: 'Actions',
      url: '/actions',
      icon: CheckIcon,
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
        { label: capitalize(pluralize(t('location'))), url: '/admin/locations' },
        { label: capitalize(pluralize(t('business unit'))), url: '/admin/business-units' },
        { label: capitalize(pluralize(t('question'))), url: '/admin/questions', permission: 'adminPanel.questions' },
        { label: `${capitalize(t('question'))} sets`, url: '/admin/questions-categories', permission: 'adminPanel.questionsCategories' },
        { label: 'Audit types', url: '/admin/audit-types', permission: 'adminPanel.auditTypes' },
        { label: 'Categories', url: '/admin/categories', permission: 'adminPanel.categories' },
        { label: 'Users', url: '/admin/users' },
        { label: 'Audit log', url: '/admin/audit-log' },
      ],
    },
    {
      type: 'menuItem',
      label: 'Components',
      url: '/components',
      icon: GridIcon,
      permission: 'home.view',
      hidden: runtimeEnv.enableComponentsPage() !== 'true'
    },
    {
      type: 'menuItem',
      label: 'Help & Support',
      url: '/help',
      icon: HelpSupportIcon,
      permission: 'home.view',
    },
  ];

  const auditNavigationTabs = [
    {
      label: capitalize(pluralize(t('question'))),
      url: '/',
      icon: EditIcon,
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

  const trackerMenuItems: INavItem[] = [
    {
      type: 'menuItem',
      label: pluralize(t('tracker item')),
      url: '/dashboard',
      icon: Home,
      permission: 'home.view',
    },
    {
      type: 'menuItem',
      label: 'Admin',
      url: '/admin',
      icon: Admin,
      permission: 'adminPanel.view',
      subSections: [
        { label: capitalize(pluralize(t('tracker item'))), url: '/admin/tracker-items' },
        { label: 'Regulatory bodies', url: '/admin/regulatory-bodies' },
        { label: 'Categories', url: '/admin/categories' },
        { label: 'Locations', url: '/admin/locations' },
        { label: pluralize(capitalize(t('business unit'))), url: '/admin/business-units' },
        { label: 'Users', url: '/admin/users' },
        { label: 'Audit log', url: '/admin/audit-log' },
        { label: 'Other settings', url: '/admin/settings' },
      ],
    },
    {
      type: 'menuItem',
      label: 'Components',
      url: '/components',
      icon: GridIcon,
      permission: 'home.view',
      hidden: runtimeEnv.enableComponentsPage() !== 'true'
    },
    {
      type: 'menuItem',
      label: 'Help & Support',
      url: '/help',
      icon: HelpSupportIcon,
      permission: 'home.view',
    },
  ];

  const initialFilters: IFilters = {
    trackerItemsIds: {
      name: capitalize(t('tracker item')),
      value: [],
    },
    categoriesIds: {
      name: 'Category',
      value: [],
    },
    businessUnitsIds: {
      name: capitalize(t('business unit')),
      value: [],
    },
    itemStatus: {
      name: 'Item status',
      value: [],
    },
    regulatoryBodiesIds: {
      name: 'Regulatory body',
      value: [],
    },
    dueDate: {
      name: 'Expires on',
      value: null,
    },
    isVerified: {
      name: 'Verified',
      value: null,
    },
    collections: {
      name: 'Data type',
      value: [],
    },
    action: {
      name: 'Action',
      value: [],
    },
    usersIds: {
      name: 'User',
      value: {
        responsibleIds: [],
        accountableIds: [],
        contributorIds: [],
        followerIds: [],
      },
    },
    locationsIds: {
      name: capitalize(t('location')),
      value: [],
    },
  };

  const auditAddItems = [
    { label: capitalize(t('audit')), url: '/', permission: 'audits.add', icon: ListIcon },
    { label: capitalize(t('location')), url: '/admin/locations', permission: 'adminPanel.view', icon: SiteIcon },
    { label: capitalize(t('business unit')), url: '/admin/business-units', permission: 'adminPanel.view', icon: LocationIcon },
    { label: capitalize(t('question')), url: '/admin/questions', permission: 'adminPanel.questions', icon: QuestionOutlineIcon },
    { label: `${capitalize(t('question'))} set`, url: '/admin/questions-categories', permission: 'adminPanel.questionsCategories', icon: CategoryIcon },
    { label: 'Audit type', url: '/admin/audit-types', permission: 'adminPanel.auditTypes', icon: ListIcon },
    { label: 'Category', url: '/admin/categories', permission: 'adminPanel.categories', icon: ListIcon },
  ];

  const trackerAddItems = [
    { label: capitalize(t('tracker item')), url: '/admin/tracker-items', icon: BlankPage },
    { label: 'Regulatory body', url: '/admin/regulatory-bodies', icon: RegulatoryBodyIcon },
    { label: 'Category', url: '/admin/categories', icon: CategoryIcon },
    { label: capitalize(t('location')), url: '/admin/locations', icon: LocationIcon },
    { label: capitalize(t('business unit')), url: '/admin/business-units', icon: TeamsIcon },
  ];

  return {
    auditsMenuItems,
    auditSearchItems,
    trackerSearchItems,
    auditNavigationTabs,
    initialFilters,
    trackerMenuItems,
    trackerAddItems,
    auditAddItems,
  };
};

export default useConfig;
