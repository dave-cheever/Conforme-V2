import { format } from 'date-fns';

import { useAppContext } from '../contexts/AppProvider';
import { useFiltersContext } from '../contexts/FiltersProvider';
import IFilter from '../interfaces/IFilter';
import IFilters, {
  IAuditFilters,
  IAuditUserFilter,
  IUserFilter,
} from '../interfaces/IFilters';

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

export const auditStatuses = {
  inProgress: 'In progress',
  completed: 'Completed',
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
  const {
    filtersValues,
    complianceItems,
    categories,
    regulatoryBodies,
    businessUnits,
    users,
    locations,
    areas,
    sites,
  } = useFiltersContext();

  const getFilters = ({
    usedFilters = [],
    oldFilters = {},
    newFilters = {},
  }: {
    usedFilters?: string[];
    oldFilters?: object;
    newFilters?: object;
  } = {}) => {
    // Make a copy of initial filters
    const cleanFilters = JSON.parse(
      JSON.stringify(
        module?.type === 'tracker' ? initialFilters : initialAuditFilters,
      ),
    );

    const filters = {};
    let filterName = '';
    for (filterName of usedFilters) {
      // Get filter config from existing or initial filters
      const filter: IFilter =
        oldFilters[filterName] || cleanFilters[filterName];

      // Check if value was set
      if (newFilters[filterName] !== undefined)
        filter.value = newFilters[filterName];

      // Set new filter
      filters[filterName] = filter;
    }

    return filters;
  };

  // Looks up friendly filter name for display
  const getFirstValue = (filterKey: string) => {
    switch (filterKey) {
      case 'complianceItemsIds': {
        const value: any = filtersValues.complianceItemsIds?.value;
        return complianceItems.find((f) => f._id === value[0])?.name;
      }
      case 'categoriesIds': {
        const value: any = filtersValues.categoriesIds?.value;
        return categories.find((f) => f._id === value[0])?.name;
      }
      case 'locationIds': {
        const value: any = filtersValues.locationsIds?.value;
        return locations.find((f) => f._id === value[0])?.name;
      }
      case 'businessUnitsIds': {
        const value: any = filtersValues.businessUnitsIds?.value;
        return businessUnits.find((f) => f._id === value[0])?.name;
      }
      case 'itemStatus': {
        const value: any = filtersValues.itemStatus?.value;
        return complianceItemStatuses[value[0]];
      }
      case 'regulatoryBodiesIds': {
        const value: any = filtersValues.regulatoryBodiesIds?.value;
        return regulatoryBodies.find((f) => f._id === value[0])?.name;
      }
      case 'dueDate': {
        const [value, startDate, endDate] = filtersValues.dueDate?.value || [];
        switch (value) {
          case 'exactDate':
            return format(
              startDate ? new Date(startDate) : new Date(),
              'd MMM yy',
            ).toString();
          case 'dateRange':
            return `${format(
              startDate ? new Date(startDate) : new Date(),
              'd MMM yy',
            ).toString()} - ${format(
              endDate ? new Date(endDate) : new Date(),
              'd MMM yy',
            ).toString()}`;
          default:
            return dates[value];
        }
      }
      case 'isVerified': {
        const value: any = filtersValues.isVerified?.value;
        return value === '1' ? 'Yes' : 'No';
      }
      case 'collections': {
        const value: any = filtersValues.collections?.value;
        return collections[value[0]];
      }
      case 'action': {
        const value: any = filtersValues.action?.value;
        return actions[value[0]];
      }
      case 'usersIds': {
        const value: any =
          module?.type === 'tracker'
            ? (filtersValues.usersIds as IUserFilter)?.value?.responsibleIds
            : (filtersValues.usersIds as IAuditUserFilter)?.value?.auditorsIds;
        return users.find((f) => f._id === value[0])?.displayName;
      }
      case 'sitesIds': {
        const value: any = filtersValues.areasIds?.value;
        return areas.find((f) => f._id === value[0])?.name;
      }
      case 'areasIds': {
        const value: any = filtersValues.sitesIds?.value;
        return sites.find((f) => f._id === value[0])?.name;
      }
      default:
        break;
    }
  };

  return {
    getFilters,
    getFirstValue,
  };
};

export default useFiltersUtils;
