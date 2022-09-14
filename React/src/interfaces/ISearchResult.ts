import { IScope } from "./IScope";

export interface ISearchResult {
  _id: string;
  title: string;
  type: string;
  user: {
    _id: string;
  };
  scope: IScope;
};
