import { IBase } from './IBase';


export interface DefaultPage {
  name?: string,
  path?: string,
}

export interface IUser extends IBase {
  organizationsIds?: string[];
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: 'reader' | 'admin' | 'user';
  imgUrl?: string;
  defaultPage?: DefaultPage[];
  lastLogin: Date;
  userCreated?: Date;

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
