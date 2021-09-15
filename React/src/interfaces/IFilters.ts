import IFilter from "./IFilter";

interface IFilterString extends IFilter {
  value: string[] | null;
}

export default interface IFilters {
  complianceItems?: IFilter,
  category?: IFilter,
  functionalAreas?: IFilter,
  businessUnits?: IFilter,
  itemStatus?: IFilterString,
  regulatoryBody?: IFilter,
  dueDate?: IFilterString,
  isVerified?: IFilter | null,
  userRole?: IFilter,
  collection?: IFilter,
  action?: IFilter,
  users?: IFilterString,
};
