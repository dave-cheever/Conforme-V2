import { IBase } from './IBase';

export interface IRecentSearch extends IBase {
  userId: string;
  term: string;
  entityId: string;
  entityType: 'audits' | 'actions' | 'answers' | 'tracker_items';
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

