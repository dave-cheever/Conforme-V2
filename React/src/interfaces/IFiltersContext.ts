import { Dispatch, SetStateAction } from 'react';

import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import IFilters, { IActionFilters, IAnswerFilters, IAuditFilters, IResponseFilters } from './IFilters';
import { ILocation } from './ILocation';
import { IQuestionsCategory } from './IQuestionsCategory';
import { ITrackerItem } from './ITrackerItem';
import { IUser } from './IUser';
import { TAnswerStatus } from './TAnswerStatus';
import { TAuditStatus } from './TAuditStatus';
import TAuditWalkType from './TAuditWalkType';
import { TDeepPartial } from './TDeepPartial';

export interface IFiltersContext {
  filtersValues: IFilters;
  setFiltersValues: Dispatch<SetStateAction<IFilters>>;
  appliedFilters: object;

  setFilters: (filters: object) => void;
  applyFilters: () => void;
  applyFiltersImmediately: (filters: object) => void;
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
  answerFiltersValue: TDeepPartial<IAnswerFilters>;
  setAnswerFiltersValue: Dispatch<SetStateAction<TDeepPartial<IAnswerFilters>>>;

  setDefaultFilters: Dispatch<SetStateAction<object>>;

  numberOfSelectedFilters: number;

  sortingState: { sortType: string; sortOrder: 'asc' | 'desc' } | null;
  setSortingState: Dispatch<SetStateAction<{ sortType: string; sortOrder: 'asc' | 'desc' } | null>>;

  trackerItems: Partial<ITrackerItem>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  users: Partial<IUser>[];
  locations: Partial<ILocation>[];
  auditStatuses: TAuditStatus[];
  answerStatuses: TAnswerStatus[];
  auditWalkTypes: TAuditWalkType[];
  questionsCategories: Partial<IQuestionsCategory>[];
}
