import { Dispatch, SetStateAction } from 'react';

import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import { IComplianceItem } from './IComplianceItem';
import IFilters, { IActionFilters, IAuditFilters, IResponseFilters, IWalkItemFilters } from './IFilters';
import { ILocation } from './ILocation';
import { IQuestionsCategory } from './IQuestionsCategory';
import { IUser } from './IUser';
import { TAuditStatus } from './TAuditStatus';
import TAuditWalkType from './TAuditWalkType';
import { TDeepPartial } from './TDeepPartial';
import { TWalkItemStatus } from './TWalkItemStatus';

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

  responseFiltersValue: TDeepPartial<IResponseFilters>;
  setResponseFiltersValue: Dispatch<SetStateAction<TDeepPartial<IResponseFilters>>>;
  auditFiltersValue: TDeepPartial<IAuditFilters>;
  setAuditFiltersValue: Dispatch<SetStateAction<TDeepPartial<IAuditFilters>>>;
  actionFiltersValue: TDeepPartial<IActionFilters>;
  setActionFiltersValue: Dispatch<SetStateAction<TDeepPartial<IActionFilters>>>;
  walkItemFiltersValue: TDeepPartial<IWalkItemFilters>;
  setWalkItemFiltersValue: Dispatch<SetStateAction<TDeepPartial<IWalkItemFilters>>>;

  numberOfSelectedFilters: number;

  complianceItems: Partial<IComplianceItem>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  users: Partial<IUser>[];
  locations: Partial<ILocation>[];
  auditStatuses: TAuditStatus[];
  walkItemStatuses: TWalkItemStatus[];
  auditWalkTypes: TAuditWalkType[];
  sites: Partial<ILocation>[];
  areas: Partial<IBusinessUnit>[];
  questionsCategories: Partial<IQuestionsCategory>[];
}
