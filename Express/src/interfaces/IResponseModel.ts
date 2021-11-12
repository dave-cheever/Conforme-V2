import { Model } from "mongoose";

import { IResponse } from "app-interfaces";

export interface IResponseModel extends Model<IResponse> {
  get: (selector?: any) => Promise<IResponse[]>;
};

