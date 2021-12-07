import { Model } from "mongoose";

import { ISetting } from "app-interfaces";

export interface ISettingModel extends Model<ISetting> {
  getByType: (type: string, organizationId:string) => Promise<ISetting[]>;
  getById: (name: string, organizationId: string) => Promise<ISetting>;
};
