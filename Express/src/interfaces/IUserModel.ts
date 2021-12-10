import { Model } from "mongoose";

import { IUser } from "app-interfaces";
import { IOrganization } from "./IOrganization";

export interface IUserModel extends Model<IUser> {
  get: ({organization: IOrganization}) => Promise<IUser[]>;
  getById: (userId: string) => Promise<IUser>;
  findByIdWithDetails: ({ userId, organization }: { userId: string, organization: IOrganization }) => Promise<IUser>;
  add: ({ userId, organization }: { userId: string, organization: IOrganization }) => Promise<IUser>;
};
