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

export interface IResponseFilters {
  locationsIds?: IFilter;
  categoriesIds?: IFilter;
  businessUnitsIds?: IFilter;
  regulatoryBodiesIds?: IFilter;
  usersIds?: IUserFilter;
}

export interface IAuditFilters {
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  walkType?: IFilterString;
  usersIds?: IAuditUserFilter;
  createdDate?: IFilterString;
  dueDate?: IFilterString;
}
export interface IActionFilters {
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  usersIds?: IActionUserFilter;
  dueDate?: IFilterString;
}

export interface IWalkItemFilters {
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  questionsCategoriesIds?: IFilter;
  usersIds?: IWalkItemUserFilter;
  createdDate?: IFilterString;
}

export default interface IFilters {
  complianceItemsIds?: IFilter;
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
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  walkType?: IFilterString;
  createdDate?: IFilterString;
}
