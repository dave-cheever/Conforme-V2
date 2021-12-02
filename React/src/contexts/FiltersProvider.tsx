import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";

import { IFiltersContext } from "../interfaces/IFiltersContext";
import IFilters from "../interfaces/IFilters";
import useFiltersUtils from "../hooks/useFiltersUtils";

export const FiltersContext = createContext({} as IFiltersContext);

const GET_FILTERS_DATA = gql`
  query ($complianceItemsQueryInput: ComplianceItemsQueryInput) {
    complianceItems(complianceItemsQueryInput: $complianceItemsQueryInput) {
      _id
      name
      published
    }
    categories {
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
    searchUsers {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFiltersContext must be used within the FiltersProvider');
  }
  return context;
};

const FiltersProvider = (props: any) => {
  const { data } = useQuery(GET_FILTERS_DATA, {
    variables: {
      complianceItemsQueryInput: {
        published: true,
      },
    },
  });
  const {
    getFilters,
  } = useFiltersUtils();
  const [filtersValues, setFiltersValues] = useState<IFilters>(getFilters());
  const [usedFilters, setUsedFilters] = useState<string[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState<boolean>(false);
  const [openedFilterPanel, setOpenedFilterPanel] = useState<string | null>(null);
  const numberOfSelectedFilters = Object.values(filtersValues).filter(({ value }) => value && value.length > 0).length;

  const setFilters = (filters = {}) => {
    setFiltersValues(getFilters({
      usedFilters,
      oldFilters: filtersValues,
      newFilters: filters,
    }));
  };

  const cleanFilters = () => {
    setFiltersValues(getFilters({
      usedFilters,
      oldFilters: {},
    }));
  };

  useEffect(() => {
    setFilters();
  }, [usedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({
    filtersValues, setFiltersValues,
    usedFilters, setUsedFilters,
    setFilters, cleanFilters,
    showFiltersPanel, setShowFiltersPanel,
    openedFilterPanel, setOpenedFilterPanel,
    numberOfSelectedFilters,
    complianceItems: data?.complianceItems,
    categories: data?.categories,
    regulatoryBodies: data?.regulatoryBodies,
    businessUnits: data?.businessUnits,
    users: [...(data?.searchUsers || [])].sort((a, b) => a.displayName.localeCompare(b.displayName)),
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    filtersValues,
    usedFilters,
    showFiltersPanel,
    openedFilterPanel,
    numberOfSelectedFilters,
    data,
  ]);

  return (
    <FiltersContext.Provider value={value}>
      {props.children}
    </FiltersContext.Provider>
  )
}

export default FiltersProvider;
