import { Dispatch, SetStateAction } from "react";

import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { IComplianceItem } from "./IComplianceItem";
import IFilters from "./IFilters";
import { IUser } from "./IUser";

export interface IFiltersContext {
  filtersValues: IFilters;
  setFiltersValues: Dispatch<SetStateAction<IFilters>>;

  setFilters: (filters: object) => void;
  cleanFilters: () => void;

  usedFilters: string[];
  setUsedFilters: Dispatch<SetStateAction<string[]>>;

  showFiltersPanel: boolean;
  setShowFiltersPanel: Dispatch<SetStateAction<boolean>>;
  
  openedFilterPanel: string | null;
  setOpenedFilterPanel: Dispatch<SetStateAction<string | null>>;
  
  responsesStatusesCounts: { [statusName: string]: number };
  setResponsesStatusesCounts: Dispatch<SetStateAction<{ [statusName: string]: number }>>;

  numberOfSelectedFilters: number;

  complianceItems: Partial<IComplianceItem>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  users: Partial<IUser>[];
}
