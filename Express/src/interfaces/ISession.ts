import { IOrganization } from "app-interfaces";

export interface ISession {
  passport: any;
  organization: Partial<IOrganization>;
}
