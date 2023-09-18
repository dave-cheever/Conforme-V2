import { IUser } from './IUser';
import { IBaseModel } from './IBaseModel';
import { IOrganization } from './IOrganization';
import IConfig from './IConfig';

export interface IUserModel extends IBaseModel<IUser> {
  customAdd: (user: Partial<IUser>, userId: string, organizationId?: string) => Promise<IUser>;
  customFindByIdWithDetails: ({
    userId,
    organization,
    config,
  }: {
    userId: string;
    organization: IOrganization;
    config: IConfig;
  }) => Promise<IUser>;
}
