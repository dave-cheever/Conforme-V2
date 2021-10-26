import { IBase } from "./IBase";

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  licenceExpirationDate: Date;
  logoUrl: string;
  theme: object;
  addons: object;
}
