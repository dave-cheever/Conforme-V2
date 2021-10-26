import { Model } from "mongoose";

import { IUser } from "app-interfaces";
import { IOrganization } from "./IOrganization";

export interface IUserModel extends Model<IUser> {
  getById: (userId: string) => Promise<IUser>;
  findByIdWithDetails: ({ userId, organization }: { userId: string, organization: IOrganization }) => Promise<IUser>;
  add: (userId: string) => Promise<IUser>;
};
