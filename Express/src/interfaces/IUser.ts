import { IBase } from 'app-interfaces';

export interface IUser extends IBase {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: string;
  managerId?: string;
  imgUrl?: string;
  defaultPage?: string;
  organizationsIds?: string[];
  userCreated?: Date;
  lastLogin?: Date;

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
