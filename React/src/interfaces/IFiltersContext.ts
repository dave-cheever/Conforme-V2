import { Dispatch, SetStateAction } from 'react';

import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import { IComplianceItem } from './IComplianceItem';
import IFilters, {
  IActionFilters,
  IAuditFilters,
  IResponseFilters,
  IWalkItemFilters,
} from './IFilters';
import { ILocation } from './ILocation';
import { IQuestionsCategory } from './IQuestionsCategory';
import { IUser } from './IUser';
import TAuditStatus from './TAuditStatus';
import TAuditWalkType from './TAuditWalkType';

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
  setResponsesStatusesCounts: Dispatch<
    SetStateAction<{ [statusName: string]: number }>
  >;

  responseFiltersValue: IResponseFilters;
  setResponseFiltersValue: Dispatch<SetStateAction<IResponseFilters>>;
  auditFiltersValue: IAuditFilters;
  setAuditFiltersValue: Dispatch<SetStateAction<IAuditFilters>>;
  actionFiltersValue: IActionFilters;
  setActionFiltersValue: Dispatch<SetStateAction<IActionFilters>>;
  walkItemFiltersValue: IWalkItemFilters;
  setWalkItemFiltersValue: Dispatch<SetStateAction<IWalkItemFilters>>;

  numberOfSelectedFilters: number;

  complianceItems: Partial<IComplianceItem>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  users: Partial<IUser>[];
  locations: Partial<ILocation>[];
  auditStatuses: TAuditStatus[];
  auditWalkTypes: TAuditWalkType[];
  sites: Partial<ILocation>[];
  areas: Partial<IBusinessUnit>[];
  questionsCategories: Partial<IQuestionsCategory>[];
}
