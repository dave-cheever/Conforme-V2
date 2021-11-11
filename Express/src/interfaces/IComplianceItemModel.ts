import { Model } from "mongoose";

import { IComplianceItem } from "app-interfaces";

export interface IComplianceItemModel extends Model<IComplianceItem> {
  getById: (_id: string) => Promise<IComplianceItem>;
};
