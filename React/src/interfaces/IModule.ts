import { TModuleType } from './TModuleType';

export interface IModuleDefaultFilters {
  audits?: object;
  actions?: object;
  answers?: object;
  responses?: object;
}

export interface IModule {
  _id: string;
  type: TModuleType;
  defaultFilters: IModuleDefaultFilters;
  name: string;
  path: string;
  showInNavigation: boolean;
  translations: { [key: string]: string };
}
