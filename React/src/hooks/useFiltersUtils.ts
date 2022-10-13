import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { t } from 'i18next';
import { capitalize, isEmpty } from 'lodash';

import { useAppContext } from '../contexts/AppProvider';
import IFilter from '../interfaces/IFilter';
import { IActionFilters, IAuditFilters, IWalkItemFilters } from '../interfaces/IFilters';
import useConfig from './useConfig';

export const auditWalkTypes = {
  virtual: 'Virtual',
  physical: 'Physical',
};

export const auditsFilterDates = {
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisYear: 'This year',
  last12Months: 'Last 12 months',
  exactDate: 'Exact date',
  dateRange: 'Date Range',
};

export const actionsFilterDates = {
  overdue: 'Overdue',
  thisWeek: 'This week',
  thisMonth: 'This month',
  thisYear: 'This year',
  last12Months: 'Last 12 months',
  exactDate: 'Exact date',
  dateRange: 'Date Range',
};

export const trackerFilterDates = {
  noDueDate: 'No due date',
  thisWeek: 'This week',
  thisMonth: 'This month',
  exactDate: 'Exact date',
  dateRange: 'Date Range',
};

export const collections = {
  'tracker-items': 'Tracker items',
  responses: 'Responses',
  'regulatory-bodies': 'Regulatory bodies',
  categories: 'Categories',
  'business-units': 'Business units',
  settings: 'Settings',
};

export const actions = {
  add: 'Added',
  update: 'Updated',
  delete: 'Deleted',
};

export const actionPriorities = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const useFiltersUtils = () => {
  const { module } = useAppContext();
  const { initialFilters } = useConfig();
  const location = useLocation();

  // Constants needs to be inside of useFiltersUtils in order to have working translations
  const trackerItemStatuses = {
    compliant: capitalize(t('compliant')),
    nonCompliant: capitalize(t('non-compliant')),
    notStarted: 'Not started',
    inProgress: 'In progress',
    completed: 'Completed',
    noDueDate: 'No due date',
    comingUp: 'Coming Up',
    missed: 'Missed',
  };
  const initialAuditFilters: IAuditFilters = {
    walkType: {
      name: 'Walk type',
      value: [],
    },
    status: {
      name: 'Status',
      value: [],
    },
    locationsIds: {
      name: capitalize(t('location')),
      value: [],
    },
    businessUnitsIds: {
      name: capitalize(t('business unit')),
      value: [],
    },
    usersIds: {
      name: 'User',
      value: {
        auditorsIds: [],
        participantsIds: [],
      },
    },
    createdDate: {
      name: 'Created date',
      value: [],
    },
    dueDate: {
      name: 'Due date',
      value: [],
    },
    showArchived: {
      name: 'Show archived',
      value: false,
      permission: 'audits.viewDeleted',
    },
  };
  const initialActionFilters: IActionFilters = {
    status: {
      name: 'Status',
      value: [],
    },
    priority: {
      name: 'Priority',
      value: [],
    },
    locationsIds: {
      name: capitalize(t('location')),
      value: [],
    },
    businessUnitsIds: {
      name: capitalize(t('business unit')),
      value: [],
    },
    usersIds: {
      name: 'User',
      value: {
        assigneesIds: [],
      },
    },
    dueDate: {
      name: 'Due date',
      value: [],
    },
  };
  const initialWalkItemFilters: IWalkItemFilters = {
    status: {
      name: 'Status',
      value: [],
    },
    questionsCategoriesIds: {
      name: 'Type',
      value: [],
      hideFromPanel: true,
    },
    locationsIds: {
      name: capitalize(t('location')),
      value: [],
    },
    businessUnitsIds: {
      name: capitalize(t('business unit')),
      value: [],
    },
    usersIds: {
      name: 'User',
      value: {
        addedByIds: [],
      },
    },
    createdDate: {
      name: 'Date added',
      value: [],
    },
  };

  const cleanAuditFilters = useMemo(() => {
    switch (location.pathname.split('/')[2]) {
      case 'actions':
        return initialActionFilters;
      case 'walk-items':
        return initialWalkItemFilters;
      case 'audits':
      default:
        return initialAuditFilters;
    }
  }, [location.pathname]);

  // Make a copy of initial filters
  const cleanFilters = useMemo(
    () => JSON.parse(JSON.stringify(module?.type === 'tracker' ? initialFilters : cleanAuditFilters)),
    [module?.type, location.pathname],
  );

  const getFilters = ({
    usedFilters = [],
    newFilters = {},
    defaultFilters = {},
    isCleanFilters = false,
  }: {
    usedFilters?: string[];
    newFilters?: object;
    defaultFilters?: object;
    isCleanFilters?: boolean;
  } = {}) => {
    const filters = {};
    for (const filterName of usedFilters) {
      // Get filter config from existing or initial filters
      const filter: IFilter = cleanFilters[filterName];

      if (!filter) continue;

      // Check if value was set
      if (newFilters[filterName] !== undefined) filter.value = newFilters[filterName];

      // Clear all values
      if (isCleanFilters) filter.value = filterName === 'usersIds' ? ({} as string) : filterName === 'showArchived' ? false : ([] as string[]);

      // Check if default value exists and set filters to defaultFilters value
      if (isCleanFilters && !isEmpty(defaultFilters) && defaultFilters[filterName] !== undefined) filter.value = defaultFilters[filterName];

      // Set new filter
      filters[filterName] = filter;
    }
    return filters;
  };

  return {
    trackerItemStatuses,
    getFilters,
  };
};

export default useFiltersUtils;
