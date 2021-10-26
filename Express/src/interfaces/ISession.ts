import { IOrganization } from "./IOrganization";

export interface ISession {
  passport: any;
  organization: Partial<IOrganization>;
}
