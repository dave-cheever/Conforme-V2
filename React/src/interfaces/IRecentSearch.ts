import { IBase } from './IBase';

export interface IRecentSearch extends IBase {
  userId: string;
  text: string;
  organizationId: string;
  metatags: {
    addedAt?: Date;
    addedBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
    removedAt?: Date;
    removedBy?: string;
  };
}

