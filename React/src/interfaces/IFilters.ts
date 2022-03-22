import IFilter from "./IFilter";

interface IFilterString extends IFilter {
  value: string[] | null;
}

interface IUserFilterObject {
  responsibleIds: string[] | null,
  accountableIds: string[] | null,
  contributorIds: string[] | null,
  followerIds: string[] | null
}

interface IUserFilter {
  name: string;
  value: IUserFilterObject | null;
}

export interface IResponseFilters {
  locationsIds?: string[] | undefined,
  categoriesIds?: string[] | undefined,
  businessUnitsIds?: string[] | undefined,
  regulatoryBodiesIds?: string[] | undefined,
}

export default interface IFilters {
  complianceItemsIds?: IFilter,
  categoriesIds?: IFilter,
  businessUnitsIds?: IFilter,
  itemStatus?: IFilterString,
  regulatoryBodiesIds?: IFilter,
  dueDate?: IFilterString,
  isVerified?: IFilter | null,
  usersRoles?: IFilter,
  collections?: IFilter,
  action?: IFilter,
  usersIds?: IUserFilter,
  locationsIds?: IFilter,
};
