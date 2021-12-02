import { IBase } from "./IBase";

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  licenceExpirationDate: Date;
  logoUrl: string;
  bgImageUrl: string;
  theme: object;
  addons: object;
  clientId: string;
  tenantId: string;
  secret:string;
}
