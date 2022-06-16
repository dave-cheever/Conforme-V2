import { TModuleType } from './TModuleType';

export interface IModule {
  _id: string;
  type: TModuleType;
  name: string;
  path: string;
  showInNavigation: boolean;
  translations: { [key: string]: string };
}
