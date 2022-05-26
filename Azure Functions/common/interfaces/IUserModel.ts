import { IUser } from './IUser';
import { IBaseModel } from './IBaseModel';
import { IOrganization } from './IOrganization';

export interface IUserModel extends IBaseModel<IUser> {
  customAdd: (user: Partial<IUser>, userId: string, organizationId?: string) => Promise<IUser>;
  customFindByIdWithDetails: ({
    userId,
    organization
  }: {
    userId: string;
    organization: IOrganization;
  }) => Promise<IUser>;
}
