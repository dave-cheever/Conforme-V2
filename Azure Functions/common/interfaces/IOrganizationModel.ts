import { IBaseModel } from "./IBaseModel";
import { IOrganization } from "./IOrganization";

export interface IOrganizationModel extends IBaseModel<IOrganization> {
  customFindByDomain: (domain: string) => Promise<IOrganization>;
};
