import { IBaseModel, IComplianceItem } from "app-interfaces";

export interface IComplianceItemModel extends IBaseModel<IComplianceItem> {
  customGenerateReference: () => Promise<string>;
  customSynchronizeResponses: ({ complianceItem, userId, organizationId, prevDueDate }: { complianceItem: IComplianceItem, userId: string, organizationId: string, prevDueDate?: Date }) => Promise<void>;
};
