import { IBaseModel, IOrganization, IUser } from 'app-interfaces';

export interface IUserModel extends IBaseModel<IUser> {
  customAdd: (user: Partial<IUser>, organizationId?: string) => Promise<IUser>;
  customFindWithDetails: ({
    selector,
    pagination,
    organization,
    awaitForResponse,
  }: {
    selector: any;
    pagination?: { limit?: number; offset?: number };
    organization: IOrganization;
    awaitForResponse?: boolean;
  }) => Promise<IUser[]>;
  customFindByIdWithDetails: ({
    userId,
    organization,
    awaitForResponse,
  }: {
    userId: string;
    organization: IOrganization;
    awaitForResponse?: boolean;
  }) => Promise<IUser>;

  /**
   * This function has a couple of purposes:
   * 1. Create a user in the databaes if he doesn't exist.
   * 2. Add an organization ID to the user's object in the database if he doesn't have it.
   *
   * While creating a new user it takes the details from Azure AD.
   */
  customAssertUser: ({ userId, organizationId }: { userId: string; organizationId: string }) => Promise<void>;
}
