import { IBase } from "app-interfaces";

export interface IUser extends IBase {
  firstName?: string;
  lastName?: string;
  displayName: string;
  email: string;
  jobTitle?: string;
  role: string;
  imgUrl?: string;
  defaultPage?: string;
  organizationsIds?: string[];
  userCreated?: Date;
  lastLogin?: Date;
  responsibleCount?: number;
  accountableCount?: number;
  contributorCount?: number;
  followerCount?: number;
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
