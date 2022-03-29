import { IBaseModel, IOrganization } from 'app-interfaces';

export interface IOrganizationModel extends IBaseModel<IOrganization> {
  customFindByDomain: (domain: string) => Promise<IOrganization>;
}
