export interface IBase {
  _id: string;
  metatags?: {
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}
