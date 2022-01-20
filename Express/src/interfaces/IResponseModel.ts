import { IBaseModel, IResponse } from "app-interfaces";

export interface IResponseModel extends IBaseModel<IResponse> {
  customRecalculateResponse: (responseId: string) => Promise<void>;
};
