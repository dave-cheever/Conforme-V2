import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';

import useFiltersUtils from '../hooks/useFiltersUtils';
import IFilters, { IActionFilters, IAnswerFilters, IAuditFilters, IResponseFilters } from '../interfaces/IFilters';
import { IFiltersContext } from '../interfaces/IFiltersContext';
import { TAnswerStatus } from '../interfaces/TAnswerStatus';
import { TAuditStatus } from '../interfaces/TAuditStatus';
import TAuditWalkType from '../interfaces/TAuditWalkType';
import { TDeepPartial } from '../interfaces/TDeepPartial';
import { useAppContext } from './AppProvider';

export const FiltersContext = createContext({} as IFiltersContext);

const GET_FILTERS_DATA = gql`
  query ($trackerItemsQueryInput: TrackerItemsQueryInput, $moduleId: ID) {
    trackerItems(trackerItemsQueryInput: $trackerItemsQueryInput) {
      trackerItems {
        _id
        name
        published
      }
    }
    categories(moduleId: $moduleId) {
      _id
      name
    }
    locations {
      _id
      name
    }
    regulatoryBodies {
      _id
      name
    }
    businessUnits {
      _id
      name
    }
    questionsCategories {
      _id
      name
    }
    users {
      _id
      firstName
      lastName
      displayName
      userId
    }
  }
`;

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) throw new Error('useFiltersContext must be used within the FiltersProvider');

  return context;
};

function FiltersProvider({ children }) {
  const { user, module } = useAppContext();
  const { data } = useQuery(GET_FILTERS_DATA, {
    variables: {
      trackerItemsQueryInput: {
        published: true,
      },
      moduleId: module?._id,
    },
  });
  const { getFilters } = useFiltersUtils();

  // NEW: Load filters from localStorage if available
  const getInitialFilters = () => {
    if (module && user) {
      const localStorageKey = `${module._id}-filters-${user.userId}`;
      const existing = localStorage.getItem(localStorageKey);
      if (existing) {
        try {
          const parsed = JSON.parse(existing);
          // parsed is an object: { [key]: { name, value } }
          // We want to extract { [key]: value } for getFilters
          const newFilters = Object.fromEntries(
            Object.entries(parsed).map(([key, obj]) => {
              if (key === 'usersIds') {
                let mergedValue;
                if (module?.type === 'tracker')
                  mergedValue = { responsibleIds: [], accountableIds: [], contributorIds: [], followerIds: [], ...(obj as any).value };
                else if (module?.type === 'audits') mergedValue = { auditorsIds: [], participantsIds: [], ...(obj as any).value };
                else if (module?.type === 'actions') mergedValue = { assigneesIds: [], ...(obj as any).value };
                else if (module?.type === 'answers') mergedValue = { addedByIds: [], ...(obj as any).value };
                else mergedValue = { ...(obj as any).value };

                return [key, mergedValue];
              }
              return [key, (obj as any).value];
            }),
          );
          // usedFilters will be the keys present in localStorage
          const usedFilters = Object.keys(newFilters);
          return getFilters({ usedFilters, newFilters });
        } catch (e) {
          // fallback to default if parsing fails
        }
      }
    }
    return getFilters();
  };

  const [filtersValues, setFiltersValues] = useState<IFilters>(getInitialFilters);
  const [appliedFilters, setAppliedFilters] = useState<object>({});
  const [usedFilters, setUsedFilters] = useState<string[]>([]);
  const [defaultFilters, setDefaultFilters] = useState<object>({});
  const [responseFiltersValue, setResponseFiltersValue] = useState<TDeepPartial<IResponseFilters>>({});
  const [auditFiltersValue, setAuditFiltersValue] = useState<TDeepPartial<IAuditFilters>>({});
  const [actionFiltersValue, setActionFiltersValue] = useState<TDeepPartial<IActionFilters>>({});
  const [answerFiltersValue, setAnswerFiltersValue] = useState<TDeepPartial<IAnswerFilters>>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [openedFilterPanel, setOpenedFilterPanel] = useState<string | null>(null);
  const [sortingState, setSortingState] = useState<{ sortType: string; sortOrder: 'asc' | 'desc' } | null>(null);
  const [responsesStatusesCounts, setResponsesStatusesCounts] = useState<{
    [statusName: string]: number;
  }>({});
  const numberOfSelectedFilters = Object.values(filtersValues).filter((filter) => {
    if (!filter?.value || filter?.hideFromPanel) return false;
    if (Array.isArray(filter?.value)) return filter?.value.length > 0;
    if (typeof filter?.value === 'object' && !Array.isArray(filter?.value) && filter?.value !== null)
      return Object.values(filter?.value).reduce((acc: number, curr) => acc + (curr as string[]).length, 0) > 0;
    return false;
  }).length;

  const setFilters = (filters = {}) => {
    // Update the UI filters immediately for user feedback
    setFiltersValues(
      getFilters({
        usedFilters,
        newFilters: filters,
      }),
    );
  };

  const applyFilters = () => {
    // Apply the current filter values to the applied filters state
    setAppliedFilters(filtersValues);
  };

  const applyFiltersImmediately = (filters: object) => {
    // Apply filters immediately, bypassing the Apply Filters button logic
    const newFilters = getFilters({
      usedFilters,
      newFilters: filters,
    });
    setFiltersValues(newFilters);
    setAppliedFilters(newFilters);
  };

  const cleanFilters = () => {
    if (module && user) {
      const localStorageKey = `${module._id}-filters-${user.userId}`;
      localStorage.removeItem(localStorageKey);
      setDefaultFilters({});
      setAppliedFilters({});
      setFiltersValues(
        getFilters({
          defaultFilters: {},
          usedFilters,
          isCleanFilters: true,
        }),
      );
    }
  };

  useEffect(() => {
    setFilters();
  }, [usedFilters, defaultFilters]);

  // Initialize applied filters when filters are first loaded
  useEffect(() => {
    if (Object.keys(filtersValues).length > 0 && Object.keys(appliedFilters).length === 0) setAppliedFilters(filtersValues);
  }, [filtersValues, appliedFilters]);

  const value = useMemo(
    () => ({
      filtersValues,
      setFiltersValues,
      appliedFilters,
      usedFilters,
      setUsedFilters,
      setFilters,
      applyFilters,
      applyFiltersImmediately,
      cleanFilters,
      showFiltersPanel,
      setShowFiltersPanel,
      openedFilterPanel,
      setOpenedFilterPanel,
      responsesStatusesCounts,
      setResponsesStatusesCounts,
      responseFiltersValue,
      setResponseFiltersValue,
      auditFiltersValue,
      setAuditFiltersValue,
      actionFiltersValue,
      setActionFiltersValue,
      answerFiltersValue,
      setAnswerFiltersValue,
      setDefaultFilters,
      numberOfSelectedFilters,
      sortingState,
      setSortingState,
      trackerItems: data?.trackerItems?.trackerItems,
      categories: data?.categories,
      locations: data?.locations,
      regulatoryBodies: data?.regulatoryBodies,
      businessUnits: data?.businessUnits,
      users: [...(data?.users || [])].sort((a, b) => a.displayName.localeCompare(b.displayName)),
      auditStatuses: ['upcoming', 'completed', 'missed'] as TAuditStatus[],
      answerStatuses: ['open', 'closed'] as TAnswerStatus[],
      auditWalkTypes: ['virtual', 'physical'] as TAuditWalkType[],
      questionsCategories: data?.questionsCategories,
    }),

    [
      filtersValues,
      usedFilters,
      showFiltersPanel,
      openedFilterPanel,
      responsesStatusesCounts,
      numberOfSelectedFilters,
      responseFiltersValue,
      setResponseFiltersValue,
      auditFiltersValue,
      setAuditFiltersValue,
      actionFiltersValue,
      setActionFiltersValue,
      answerFiltersValue,
      setAnswerFiltersValue,
      sortingState,
      data,
    ],
  );

  return (
    <FiltersContext.Provider data-id="000013" value={value}>
      {children}
    </FiltersContext.Provider>
  );
}

export default FiltersProvider;
