import { IBase } from './IBase';
import { IModule } from './IModule';

export interface IOrganization extends IBase {
  name: string;
  domain: string;
  logoUrl: string;
  logoUrlMobile?: string;
  bgImageUrl: string;
  bgImageTabletUrl: string;
  theme: object;
  modules: IModule[];
  revokedPermissions?: string[];
  loginText?: string;
  logoutText?: string;
}
