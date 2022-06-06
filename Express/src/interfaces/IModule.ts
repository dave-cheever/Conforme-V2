import { TModuleType } from 'app-interfaces';

export interface IModule {
  type: TModuleType;
  name: string;
  path: string;
  showInNavigation: boolean;
  translations: { [key: string]: string }; // list of translations used in the app
}
