import { IBaseModel, IResponse } from "app-interfaces";

export interface IResponseModel extends IBaseModel<IResponse> {
  customRecalculateResponse: () => Promise<void>;
};
