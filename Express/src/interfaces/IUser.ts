import { IScope } from 'app-interfaces';
import { Types } from 'mongoose';

export interface DefaultPage {
  name?: string,
  path?: string,
}

export interface IUser {
  _id: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: string;
  managerId?: string;
  userId: string;
  imgUrl?: string;
  defaultPage?:DefaultPage[];
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
