import { IBaseModel } from "./IBaseModel";
import { ISetting } from "./ISetting";

export interface ISettingModel extends IBaseModel<ISetting> {
  customFindByType: (
    type: string,
    organizationId: string | string[]
  ) => Promise<ISetting[]>;
  customFindByName: (
    name: string,
    organizationId: string | string[]
  ) => Promise<ISetting[]>;
  customFindOneByName: (
    name: string,
    organizationId: string | string[]
  ) => Promise<ISetting>;
}
