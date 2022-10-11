import IFilter from './IFilter';
import IFilterString from './IFilterString';

interface IUserFilterObject {
  responsibleIds: string[] | null;
  accountableIds: string[] | null;
  contributorIds: string[] | null;
  followerIds: string[] | null;
}

interface IAuditUserFilterObject {
  auditorsIds: string[] | null;
  participantsIds: string[] | null;
}

interface IActionUserFilterObject {
  assigneesIds: string[] | null;
}

interface IWalkItemUserFilterObject {
  addedByIds: string[] | null;
}

export interface IUserFilter {
  name: string;
  value: IUserFilterObject | null;
}

export interface IAuditUserFilter {
  name: string;
  value: IAuditUserFilterObject | null;
}
export interface IActionUserFilter {
  name: string;
  value: IActionUserFilterObject | null;
}

export interface IWalkItemUserFilter {
  name: string;
  value: IWalkItemUserFilterObject | null;
}

export interface IFilterBoolean {
  name: string;
  value: boolean;
  hideFromPanel?: boolean;
  permission?: string;
}

export interface IResponseFilters {
  locationsIds?: IFilter;
  categoriesIds?: IFilter;
  businessUnitsIds?: IFilter;
  regulatoryBodiesIds?: IFilter;
  usersIds?: IUserFilter;
}

export interface IAuditFilters {
  locationsIds?: IFilter;
  businessUnitsIds?: IFilter;
  status?: IFilterString;
  walkType?: IFilterString;
  usersIds?: IAuditUserFilter;
  createdDate?: IFilterString;
  dueDate?: IFilterString;
  showArchived?: IFilterBoolean;
}
export interface IActionFilters {
  locationsIds?: IFilter;
  businessUnitsIds?: IFilter;
  status?: IFilterString;
  priority?: IFilterString;
  usersIds?: IActionUserFilter;
  dueDate?: IFilterString;
}

export interface IWalkItemFilters {
  locationsIds?: IFilter;
  businessUnitsIds?: IFilter;
  status?: IFilterString;
  questionsCategoriesIds?: IFilter;
  usersIds?: IWalkItemUserFilter;
  createdDate?: IFilterString;
}

export default interface IFilters {
  trackerItemsIds?: IFilter;
  categoriesIds?: IFilter;
  businessUnitsIds?: IFilter;
  itemStatus?: IFilterString;
  regulatoryBodiesIds?: IFilter;
  dueDate?: IFilterString;
  isVerified?: IFilter | null;
  usersRoles?: IFilter;
  collections?: IFilter;
  action?: IFilter;
  usersIds?: IUserFilter | IAuditUserFilter | IActionUserFilter | IWalkItemUserFilter;
  locationsIds?: IFilter;
  status?: IFilterString;
  priority?: IFilterString;
  walkType?: IFilterString;
  createdDate?: IFilterString;
  showArchived?: IFilterBoolean;
}
