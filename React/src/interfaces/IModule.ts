import { TModuleType } from './TModuleType';

export interface IModule {
  type: TModuleType;
  name: string;
  path: string;
  showInNavigation: boolean;
  translations: { [key: string]: string };
}
