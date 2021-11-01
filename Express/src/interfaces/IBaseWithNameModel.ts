import { Model } from "mongoose";

import { IBaseWithName } from "app-interfaces";

export interface IBaseWithNameModel extends Model<IBaseWithName> {
  getById: (_id: string) => Promise<IBaseWithName>;
  get: (selector?: any) => Promise<IBaseWithName[]>;
};
