import { IAudit, IBaseModel, IUser } from 'app-interfaces';

export interface IAuditModel extends IBaseModel<IAudit> {
  customSearch: (
    searchQuery: string,
    user: IUser,
    organizationId: string,
  ) => Promise<IAudit>;
  customGenerateReference: () => Promise<string>;
}
