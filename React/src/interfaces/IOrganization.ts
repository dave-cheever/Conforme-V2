import { IBase } from "./IBase";

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  logoUrl: string;
  theme: {
    colors: {
      brand: object;
    };
  };
  addons: object;
  allowedTenantsIds: string[]; // 'all' for all tenants
}
