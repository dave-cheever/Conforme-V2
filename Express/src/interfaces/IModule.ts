import { TModuleType } from 'app-interfaces';

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
  icon: string;
  showInNavigation: boolean;
  translations: { [key: string]: string }; // list of translations used in the app
  customQuestionsInDashboard: string[]; // up to two custom questions that will be displayed in a card or list in a dashboard (for now just in Tracker)
}
