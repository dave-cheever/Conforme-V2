export interface IBase {
  _id: string;
  _doc?: any;
  metatags: {
    addedBy: string;
    addedAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}
