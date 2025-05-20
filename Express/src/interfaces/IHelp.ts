export interface IHelp {
  _id: string;
  module: string;
  content: string;
  metatags: {
    addedAt?: Date;
    addedBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    removedAt?: Date;
    removedBy?: string;
  };
}
