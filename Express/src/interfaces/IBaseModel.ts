import { Model } from "mongoose";

export interface IBaseModel<I> extends Model<I> {
  customCreate: (document: I, userId: string, organizationId?: string) => Promise<I>;
  customFindById: (_id: string, organizationId?: string) => Promise<I>;
  customFind: (selector?: any, organizationId?: string) => Promise<I[]>;
  customUpdateOne: (selector: object, updatedDocument: I, userId: string, organizationId?: string) => Promise<number>;
};
