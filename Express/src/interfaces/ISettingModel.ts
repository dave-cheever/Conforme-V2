import { IBaseModel, ISetting } from "app-interfaces";

export interface ISettingModel extends IBaseModel<ISetting> {
  customFindByType: (type: string, organizationId: string) => Promise<ISetting[]>;
};
