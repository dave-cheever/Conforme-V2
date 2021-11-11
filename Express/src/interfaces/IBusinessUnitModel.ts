import { Model } from "mongoose";

import { IBusinessUnit } from "app-interfaces";

export interface IBusinessUnitModel extends Model<IBusinessUnit> {
  getById: (_id: string) => Promise<IBusinessUnit>;
  get: (selector?: any) => Promise<IBusinessUnit[]>;
};
