import { IBase } from 'app-interfaces';

export interface IRecentSearch extends IBase {
  userId: string;
  text: string;
}

