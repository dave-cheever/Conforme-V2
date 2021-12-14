import { IBaseModel, IComplianceItem } from "app-interfaces";

export interface IComplianceItemModel extends IBaseModel<IComplianceItem> {
  customGenerateReference: () => Promise<string>;
  customSynchronizeResponses: ({ userId, prevDueDate }: { userId: string, prevDueDate?: Date }) => Promise<void>;
};
