import { IBaseModel, IOrganization, IResponse, IUser } from 'app-interfaces';

export interface IResponseModel extends IBaseModel<IResponse> {
  customSearch: (
    searchQuery: any,
    user: IUser,
    organizationId: string,
  ) => Promise<IResponse>;
  customRecalculateResponse: (responseId: string) => Promise<void>;
  customAssigneeNotification: (responseId: string, participantsIds: string[], assignedRole: string, organization: IOrganization) => Promise<void>;
  submitReviewNotification: (response: IResponse, organization: IOrganization) => Promise<void>;
}
