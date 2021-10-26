import { Model } from "mongoose";

import { ISetting } from "app-interfaces";

export interface ISettingModel extends Model<ISetting> {
  getByType: (type: string) => Promise<ISetting[]>;
};
