import { Model } from "mongoose";

import { IComplianceItem } from "app-interfaces";

export interface IComplianceItemModel extends Model<IComplianceItem> {
  getById: (_id: string) => Promise<IComplianceItem>;
  get: (selector?: any) => Promise<IComplianceItem[]>;
  syncResponses: ({ userId, prevDueDate }: { userId: string, prevDueDate?: Date }) => Promise<void>;
};
