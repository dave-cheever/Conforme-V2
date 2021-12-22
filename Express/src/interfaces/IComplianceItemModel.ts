import { IBaseModel, IComplianceItem } from "app-interfaces";
import { IOrganization } from "./IOrganization";

export interface IComplianceItemModel extends IBaseModel<IComplianceItem> {
  customGenerateReference: () => Promise<string>;
  customSynchronizeResponses: ({ userId, prevDueDate, organization }: { userId: string, prevDueDate?: Date, organization: IOrganization }) => Promise<void>;
};
