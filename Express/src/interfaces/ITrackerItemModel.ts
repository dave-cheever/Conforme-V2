import { IBaseModel, ITrackerItem } from 'app-interfaces';

export interface ITrackerItemModel extends IBaseModel<ITrackerItem> {
  customGenerateReference: () => Promise<string>;
  customSynchronizeResponses: ({
    trackerItem,
    userId,
    organizationId,
    prevDueDate,
  }: {
    trackerItem: ITrackerItem;
    userId: string;
    organizationId: string;
    prevDueDate?: Date;
  }) => Promise<void>;
}
