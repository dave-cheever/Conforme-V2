import { IBaseModel, IOrganization, IUser } from "app-interfaces";

export interface IUserModel extends IBaseModel<IUser> {
  customFindByIdWithDetails: ({ userId, organization }: { userId: string, organization: IOrganization }) => Promise<IUser>;
};
