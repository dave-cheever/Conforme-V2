import { IBaseModel, IOrganization, IUser } from 'app-interfaces';

export interface IUserModel extends IBaseModel<IUser> {
  customAdd: (
    user: Partial<IUser>,
    userId: string,
    organizationId?: string
  ) => Promise<IUser>;
  customFindByIdWithDetails: ({
    userId,
    organization,
  }: {
    userId: string;
    organization: IOrganization;
  }) => Promise<IUser>;
}
