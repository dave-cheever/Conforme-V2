import { IBase } from './IBase';

export interface IRecentSearch extends IBase {
  userId: string;
  term: string;
  entityId: string;
  entityType: 'locations' | 'audits' | 'actions' | 'complaints';
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

