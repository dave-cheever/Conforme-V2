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

export interface IResponseFilters {
  locationsIds?: string[] | undefined;
  categoriesIds?: string[] | undefined;
  businessUnitsIds?: string[] | undefined;
  regulatoryBodiesIds?: string[] | undefined;
}

export interface IAuditFilters {
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  walkType?: IFilterString;
  usersIds?: IAuditUserFilter;
}
export interface IActionFilters {
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  usersIds?: IActionUserFilter;
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
  usersIds?: IUserFilter | IAuditUserFilter | IActionUserFilter;
  locationsIds?: IFilter;
  sitesIds?: IFilter;
  areasIds?: IFilter;
  status?: IFilterString;
  walkType?: IFilterString;
}
