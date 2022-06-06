import { IBase } from './IBase';

export interface IUser extends IBase {
  organizationsIds?: string[];
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: 'reader' | 'admin' | 'user';
  imgUrl?: string;
  defaultPage?: string;
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
}
