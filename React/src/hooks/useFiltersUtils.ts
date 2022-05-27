import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppContext } from '../contexts/AppProvider';
import IFilter from '../interfaces/IFilter';
import IFilters, { IActionFilters, IAuditFilters, IWalkItemFilters } from '../interfaces/IFilters';

export const initialFilters: IFilters = {
  complianceItemsIds: {
    name: 'Compliance item',
    value: [],
  },
  categoriesIds: {
    name: 'Category',
    value: [],
  },
  businessUnitsIds: {
    name: 'Business unit',
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
    name: 'Location',
    value: [],
  },
};

export const initialAuditFilters: IAuditFilters = {
  walkType: {
    name: 'Walk type',
    value: [],
  },
  status: {
    name: 'Status',
    value: [],
  },
  sitesIds: {
    name: 'Site',
    value: [],
  },
  areasIds: {
    name: 'Area',
    value: [],
  },
  usersIds: {
    name: 'User',
    value: {
      auditorsIds: [],
      participantsIds: [],
    },
  },
};

export const initialActionFilters: IActionFilters = {
  status: {
    name: 'Status',
    value: [],
    hideFromPanel: true,
  },
  sitesIds: {
    name: 'Site',
    value: [],
  },
  areasIds: {
    name: 'Area',
    value: [],
  },
  usersIds: {
    name: 'User',
    value: {
      assigneesIds: [],
    },
  },
};

export const initialWalkItemFilters: IWalkItemFilters = {
  questionsCategoriesIds: {
    name: 'Type',
    value: [],
    hideFromPanel: true,
  },
  areasIds: {
    name: 'Area',
    value: [],
  },
  usersIds: {
    name: 'User',
    value: {
      addedByIds: [],
    },
  },
};

export const auditWalkTypes = {
  virtual: 'Virtual',
  physical: 'Physical',
};

export const complianceItemStatuses = {
  compliant: 'Compliant',
  nonCompliant: 'Non-compliant',
  notStarted: 'Not started',
  inProgress: 'In progress',
  completed: 'Completed',
  noDueDate: 'No due date',
  comingUp: 'Coming Up',
  overdue: 'Overdue',
};

export const dates = {
  noDueDate: 'No due date',
  thisWeek: 'This week',
  thisMonth: 'This month',
  exactDate: 'Exact date',
  dateRange: 'Date Range',
};

export const collections = {
  'compliance-items': 'Compliance items',
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

const useFiltersUtils = () => {
  const { module } = useAppContext();
  const location = useLocation();

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
  }: {
    usedFilters?: string[];
    newFilters?: object;
  } = {}) => {
    const filters = {};
    let filterName = '';
    for (filterName of usedFilters) {
      // Get filter config from existing or initial filters
      const filter: IFilter = cleanFilters[filterName];

      // Check if value was set
      if (newFilters[filterName] !== undefined) filter.value = newFilters[filterName];

      // Set new filter
      filters[filterName] = filter;
    }

    return filters;
  };

  return {
    getFilters,
  };
};

export default useFiltersUtils;
