import { format } from "date-fns";
import { useFiltersContext } from "../contexts/FiltersProvider";
import IFilter from "../interfaces/IFilter";
import IFilters from "../interfaces/IFilters";

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
  nextMonth: 'Next month',
  exactDate: 'Exact date',
  dateRange: 'Date range',
};

export const collections = {
  'compliance-items': 'Compliance items',
  responses: 'Responses',
  'regulatory-bodies': 'Regulatory bodies',
  categories: 'Categories',
  'functional-areas': 'Functional areas',
  'business-units': 'Business units',
  settings: 'Settings'
};

export const actions = {
  add: 'Added',
  update: 'Updated',
  delete: 'Deleted'
};

const useFiltersUtils = () => {
  const {
    filtersValues,
    complianceItems,
    categories,
    functionalAreas,
    regulatoryBodies,
    businessUnits
  } = useFiltersContext();

  const getFilters = ({
    usedFilters = [],
    oldFilters = {},
    newFilters = {}
  }: {
    usedFilters?: string[];
    oldFilters?: object;
    newFilters?: object;
  } = {}) => {
    // Make a copy of initial filters
    const cleanFilters = JSON.parse(JSON.stringify(initialFilters));

    const filters: IFilters = {};
    let filterName: string = '';
    for (filterName of usedFilters) {
      // Get filter config from existing or initial filters
      const filter: IFilter = oldFilters[filterName] || cleanFilters[filterName];

      // Check if value was set
      if (newFilters[filterName] !== undefined) {
        filter.value = newFilters[filterName];
      }

      // Set new filter
      filters[filterName] = filter;
    }

    return filters;
  };

  // Looks up friendly filter name for display
  const getFirstValue = (filterKey: string) => {
    switch (filterKey) {
      case 'complianceItems': {
        const value: any = filtersValues.complianceItems?.value;
        return complianceItems.find(f => f._id === value[0])?.name;
      }
      case 'category': {
        const value: any = filtersValues.category?.value;
        return categories.find(f => f._id === value[0])?.name;
      }
      case 'functionalAreas': {
        const value: any = filtersValues.functionalAreas?.value;
        return functionalAreas.find(f => f._id === value[0])?.name;
      }
      case 'businessUnits': {
        const value: any = filtersValues.businessUnits?.value;
        return businessUnits.find(f => f._id === value[0])?.name;
      }
      case 'itemStatus': {
        const value: any = filtersValues.itemStatus?.value;
        return complianceItemStatuses[value[0]];
      }
      case 'regulatoryBody': {
        const value: any = filtersValues.regulatoryBody?.value;
        return regulatoryBodies.find(f => f._id === value[0])?.name;
      }
      case 'dueDate': {
        const [value, startDate, endDate] = filtersValues.dueDate?.value || [];
        switch (value) {
          case 'exactDate':
            return format(startDate ? new Date(startDate) : new Date(), 'Do MMM YY').toString();
          case 'dateRange':
            return `${format(startDate ? new Date(startDate) : new Date(), 'Do MMM YY').toString()} - ${format(endDate ? new Date(endDate) : new Date(), 'Do MMM YY').toString()}`;
          default:
            return dates[value];
        }
      };
      case 'isVerified': {
        const value: any = filtersValues.isVerified?.value;
        return value === '1' ? 'Yes' : 'No';
      }
      case 'collection': {
        const value: any = filtersValues.collection?.value;
        return collections[value[0]];
      }
      case 'action': {
        const value: any = filtersValues.action?.value;
        return actions[value[0]];
      }
      // case 'users': {
      //   const value: any = filtersValues.users?.value;
      //   return users.find(f => f._id === value[0])?.firstName;
      // }
    }
  };

  return {
    getFilters,
    getFirstValue,
  };
};

export default useFiltersUtils;
