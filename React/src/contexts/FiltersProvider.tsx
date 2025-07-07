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
    }
  }
`;

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) throw new Error('useFiltersContext must be used within the FiltersProvider');

  return context;
};

function FiltersProvider({ children }) {
  const { module } = useAppContext();
  const { data } = useQuery(GET_FILTERS_DATA, {
    variables: {
      trackerItemsQueryInput: {
        published: true,
      },
      moduleId: module?._id,
    },
  });
  const { getFilters } = useFiltersUtils();
  const [filtersValues, setFiltersValues] = useState<IFilters>(getFilters());
  const [usedFilters, setUsedFilters] = useState<string[]>([]);
  const [defaultFilters, setDefaultFilters] = useState<object>({});
  const [responseFiltersValue, setResponseFiltersValue] = useState<TDeepPartial<IResponseFilters>>({});
  const [auditFiltersValue, setAuditFiltersValue] = useState<TDeepPartial<IAuditFilters>>({});
  const [actionFiltersValue, setActionFiltersValue] = useState<TDeepPartial<IActionFilters>>({});
  const [answerFiltersValue, setAnswerFiltersValue] = useState<TDeepPartial<IAnswerFilters>>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [openedFilterPanel, setOpenedFilterPanel] = useState<string | null>(null);
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
    setFiltersValues(
      getFilters({
        usedFilters,
        newFilters: filters,
      }),
    );
  };

  const cleanFilters = () => {
    setFiltersValues(
      getFilters({
        defaultFilters,
        usedFilters,
        isCleanFilters: true,
      }),
    );
  };

  useEffect(() => {
    setFilters();

    return () => cleanFilters();
  }, [usedFilters, defaultFilters]);

  const value = useMemo(
    () => ({
      filtersValues,
      setFiltersValues,
      usedFilters,
      setUsedFilters,
      setFilters,
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
      data,
    ],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export default FiltersProvider;
