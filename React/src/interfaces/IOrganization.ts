import { IBase } from "./IBase";

export interface IAddon {
  name: string;
}

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  logoUrl: string;
  bgImageUrl: string;
  bgImageTabletUrl: string;
  theme: object;
  addons: IAddon[];
}
