import { Dispatch, SetStateAction } from "react";

import IFilters from "./IFilters";

export interface IFiltersContext {
  filters: IFilters;
  setFilters: Dispatch<SetStateAction<IFilters>>,
}
