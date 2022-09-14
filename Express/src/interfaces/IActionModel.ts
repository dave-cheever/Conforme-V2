import { IAction, IBaseModel, IOrganization, ISearchResult, IUser } from 'app-interfaces';

export interface IActionModel extends IBaseModel<IAction> {
  /**
   * This function searches for actions according to provided search query
   */
  customSearch: (searchQuery: { searchText: string; }, user: IUser, organizationId: string) => Promise<ISearchResult[]>;

  /**
   * This function adds assigned user to the different objects depends on when action was created.
   * E.g. adds user as participant to the audit
   */
  customAssertAssignee: (actionId: string) => Promise<void>;

  /**
   * This function sends an email to current assignee (if exist)
   */
  customAssigneeNotification: (actionId: string, organization: IOrganization) => Promise<void>;

  /**
   * This function sends an email when action is completed
   */
  customCompletedNotification: (actionId: string, organization: IOrganization) => Promise<void>;
}
