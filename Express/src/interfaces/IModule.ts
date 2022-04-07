import { TModuleType } from "app-interfaces";

export interface IModule {
  type: TModuleType;
  name: string;
  path: string;
  showInNavigation: boolean;
}
