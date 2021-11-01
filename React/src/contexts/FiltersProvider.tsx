import React, { createContext, useContext, useMemo, useState } from "react";

import { IFiltersContext } from "../interfaces/IFiltersContext";
import IFilters from "../interfaces/IFilters";
import { getFilters } from "../utils/helpers";

export const FiltersContext = createContext({} as IFiltersContext);

export const useFiltersContext = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error ('useFiltersContext must be used within the FiltersProvider');
  }
  return context;
};

const FiltersProvider = (props: any) => {
  const [filters, setFilters] = useState<IFilters>(getFilters());
  
  const value = useMemo(() => ({
    filters, setFilters,
  }), [ // eslint-disable-line react-hooks/exhaustive-deps
    filters,
  ]);

  return (
    <FiltersContext.Provider value={value}>
      {props.children}
    </FiltersContext.Provider>
  )
}

export default FiltersProvider;
