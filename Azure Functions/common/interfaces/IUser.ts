import { IBase } from './IBase';

export interface IUser extends IBase {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role?: string;
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
}
