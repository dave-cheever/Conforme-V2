import { Model } from 'mongoose';

export interface IBaseModel<I> extends Model<I> {
  customCreate: (document: Partial<I>, userId: string, organizationId: string) => Promise<I>;
  customFindById: (userId: string, organizationId: string) => Promise<I>;
  customFind: (selector: object, organizationId: string, pagination?: { limit?: number; offset?: number }) => Promise<I[]>;
  customFindOne: (selector: object, organizationId: string) => Promise<I>;
  customUpdateOne: (selector: object, updatedDocument: Partial<I>, userId: string, organizationId: string) => Promise<I>;
  customDelete: (selector: object, userId: string, organizationId: string) => Promise<number>;

  /**
   * This function deletes multiple elements
   */
  customDeleteMany: (selector: object, userId: string, organizationId: string) => Promise<number>;
  /*
   * This functions create element if doesnot find one
   */
  customFindOneOrCreateOne: (
    selector: { [x: string]: string },
    organizationId: string,
    userId: string,
  ) => Promise<I & { created?: boolean }>;
}
