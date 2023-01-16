import { IBaseModel, ITrackerItem } from 'app-interfaces';

export interface ITrackerItemModel extends IBaseModel<ITrackerItem> {
  customGenerateReference: () => Promise<string>;
  customSynchronizeResponses: ({
    trackerItem,
    userId,
    prevDueDate,
    sendNotification,
    organizationId,
  }: {
    trackerItem: ITrackerItem;
    userId: string;
    prevDueDate?: Date;
    sendNotification?: boolean;
    organizationId: string;
  }) => Promise<void>;
}
