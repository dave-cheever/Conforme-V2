import IFilter from "./IFilter";

interface IFilterString extends IFilter {
  value: string[] | null;
}

export default interface IFilters {
  complianceItemsIds?: IFilter,
  categoriesIds?: IFilter,
  functionalAreasIds?: IFilter,
  businessUnitsIds?: IFilter,
  itemStatus?: IFilterString,
  regulatoryBodiesIds?: IFilter,
  dueDate?: IFilterString,
  isVerified?: IFilter | null,
  usersRoles?: IFilter,
  collections?: IFilter,
  action?: IFilter,
  usersIds?: IFilterString,
};
