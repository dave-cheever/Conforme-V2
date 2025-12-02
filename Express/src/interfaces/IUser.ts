import { IScope } from 'app-interfaces';

export interface DefaultPage {
  name?: string;
  path?: string;
}

export interface FilterPreset {
  _id: string;
  name: string;
  filters: Record<string, any>;
  moduleId: string;
  moduleType: string;
  pageName: string;
  userId: string;
  metadata: {
    modulePath: string;
    fullPath: string;
    usedFilters: string[];
  };
  metatags: {
    addedBy: string;
    addedAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}

export interface IUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: string;
  managerId?: string;
  userId: string;
  imgUrl?: string;
  defaultPage?: DefaultPage[];
  organizationsIds?: string[];
  userCreated?: Date;
  lastLogin?: Date;

  _doc?: any;
  organizationId: string;
  scope?: IScope;
  metatags: {
    addedBy: string;
    addedAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };

  // Additional fields
  responsibleCount?: number;
  accountableCount?: number;
  contributorCount?: number;
  followerCount?: number;

  completedAuditsCount?: number;
  upcomingAuditsCount?: number;
  missedAuditsCount?: number;
  totalAuditsCount?: number;

  totalActionsCount?: number;
  completedActionsCount?: number;
  inProgressActionsCount?: number;
  overdueActionsCount?: number;

  openAnswersCount?: number;
  resolvedAnswersCount?: number;
  closedAnswersCount?: number;
  totalAnswersCount?: number;
  filtersPreset?: FilterPreset[];
}

export interface IGraphUser {
  id: string;
  firstName: string;
  displayName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  imgUrl: string;
}
