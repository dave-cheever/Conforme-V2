import { IAudit, IBaseModel, ISearchResult, IUser } from 'app-interfaces';

export interface IAuditModel extends IBaseModel<IAudit> {
  customSearch: (searchQuery: { searchText: string; }, user: IUser, organizationId: string) => Promise<ISearchResult[]>;
  customGenerateReference: () => Promise<string>;
}
