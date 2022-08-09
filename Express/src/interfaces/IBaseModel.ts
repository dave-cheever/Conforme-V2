import { Model } from 'mongoose';
import { IComment } from './IComment';

export interface IBaseModel<I> extends Model<I> {
  customCreate: (
    document: Partial<I>,
    userId: string,
    organizationId: string
  ) => Promise<I>;
  customFindById: (_id: string, organizationId: string) => Promise<I>;
  customFind: (selector: object, organizationId: string) => Promise<I[]>;
  customFindOne: (selector: object, organizationId: string) => Promise<I>;
  customUpdateOne: (
    selector: object,
    updatedDocument: Partial<I>,
    userId: string,
    organizationId: string,
  ) => Promise<I>;
  customDelete: (
    selector: object,
    userId: string,
    organizationId: string
  ) => Promise<number>;

  /**
   * This function deletes multiple elements
   */
  customDeleteMany: (selector: object, userId: string, organizationId: string) => Promise<number>;
}
