import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { gql, useQuery } from '@apollo/client';

import useFiltersUtils from '../hooks/useFiltersUtils';
import IFilters, { IActionFilters, IAuditFilters, IResponseFilters, IWalkItemFilters } from '../interfaces/IFilters';
import { IFiltersContext } from '../interfaces/IFiltersContext';
import { TAuditStatus } from '../interfaces/TAuditStatus';
import TAuditWalkType from '../interfaces/TAuditWalkType';
import { TDeepPartial } from '../interfaces/TDeepPartial';
import { TWalkItemStatus } from '../interfaces/TWalkItemStatus';

export const FiltersContext = createContext({} as IFiltersContext);

const GET_FILTERS_DATA = gql`
  query ($trackerItemsQueryInput: TrackerItemsQueryInput) {
    trackerItems(trackerItemsQueryInput: $trackerItemsQueryInput) {
      _id
      name
      published
    }
    categories {
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

const FiltersProvider = ({ children }) => {
  const { data } = useQuery(GET_FILTERS_DATA, {
    variables: {
      trackerItemsQueryInput: {
        published: true,
      },
    },
  });
  const { getFilters } = useFiltersUtils();
  const [filtersValues, setFiltersValues] = useState<IFilters>(getFilters());
  const [usedFilters, setUsedFilters] = useState<string[]>([]);
  const [defaultFilters, setDefaultFilters] = useState<object>({});
  const [responseFiltersValue, setResponseFiltersValue] = useState<TDeepPartial<IResponseFilters>>({});
  const [auditFiltersValue, setAuditFiltersValue] = useState<TDeepPartial<IAuditFilters>>({});
  const [actionFiltersValue, setActionFiltersValue] = useState<TDeepPartial<IActionFilters>>({});
  const [walkItemFiltersValue, setWalkItemFiltersValue] = useState<TDeepPartial<IWalkItemFilters>>({});
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [openedFilterPanel, setOpenedFilterPanel] = useState<string | null>(null);
  const [responsesStatusesCounts, setResponsesStatusesCounts] = useState<{
    [statusName: string]: number;
  }>({});
  const numberOfSelectedFilters = Object.values(filtersValues).filter(
    (filter) => filter?.value && !filter?.hideFromPanel && filter?.value.length > 0,
  ).length;

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
      walkItemFiltersValue,
      setWalkItemFiltersValue,
      setDefaultFilters,
      numberOfSelectedFilters,
      trackerItems: data?.trackerItems,
      categories: data?.categories,
      locations: data?.locations,
      regulatoryBodies: data?.regulatoryBodies,
      businessUnits: data?.businessUnits,
      users: [...(data?.users || [])].sort((a, b) => a.displayName.localeCompare(b.displayName)),
      auditStatuses: ['upcoming', 'completed', 'missed'] as TAuditStatus[],
      walkItemStatuses: ['open', 'closed'] as TWalkItemStatus[],
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
      walkItemFiltersValue,
      setWalkItemFiltersValue,
      data,
    ],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export default FiltersProvider;
