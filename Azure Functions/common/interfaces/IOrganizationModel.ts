import { IBaseModel } from './IBaseModel';
import { IOrganization } from './IOrganization';

export interface IOrganizationModel extends IBaseModel<IOrganization> {
  customFindById: (_id: string) => Promise<IOrganization>;
  customFindByDomain: (domain: string) => Promise<IOrganization>;
}
