import { IBaseModel, IOrganization, IResponse, ISearchResult, IUser } from 'app-interfaces';

export interface IResponseModel extends IBaseModel<IResponse> {
  customUpdateOne: (
    selector: object,
    updatedDocument: Partial<IResponse>,
    userId: string, organizationId: string,
    sendNotification?: boolean
  ) => Promise<IResponse>;

  customSearch: (searchQuery: { searchText: string; includeNotPublished?: boolean; }, user: IUser, organizationId: string) => Promise<ISearchResult[]>;
  customRecalculateResponse: (responseId: string) => Promise<void>;
  customAssigneeNotification: (
    responseId: string,
    participantsIds: string[],
    assignedRole: string,
    organization: IOrganization,
  ) => Promise<void>;
  submitReviewNotification: (response: IResponse, organization: IOrganization) => Promise<void>;
}
