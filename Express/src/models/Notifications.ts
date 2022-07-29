import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { INotification } from '../interfaces/INotification';
import { INotificationModel } from '../interfaces/INotificationModel';
import { genMetatags } from '../utils';

const notificationsSchema = new Schema<INotification, INotificationModel>({
  _id: String,
  emailType: String,
  emailData: Schema.Types.Mixed,
  to: [String],
  status: {
    type: String,
    enum: ['pending', 'processing', 'sent', 'failed'],
  },
  sentDate: Date,
  organizationId: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

notificationsSchema.statics.customCreate = async function (
  notification: INotification,
  userId: string,
  organizationId: string,
): Promise<INotification> {
  const createdNotification = await this.create({
    ...notification,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdNotification;
};

notificationsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<INotification[]> {
  const notifications = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return notifications;
};

notificationsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<INotification | null> {
  const notification = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return notification;
};

notificationsSchema.statics.customFindById = async function (
  _id: string,
): Promise<INotification> {
  const notification = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!notification) throw new Error('Notification not found');

  return notification;
};

notificationsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<INotification>,
  userId: string,
  organizationId: string,
): Promise<INotification> {
  const notification = await this.customFindOne(selector, organizationId);
  if (!notification) throw new Error("Notification doesn't exist");

  const updatedNotification = {
    ...notification,
    ...updates,
    metatags: {
      ...notification?.metatags,
      ...genMetatags('updated', userId),
    },
  };

  return updatedNotification;
};

notificationsSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const notification = await this.customFindOne(selector, organizationId);
  if (!notification) throw new Error("Notification doesn't exist");

  const updatedNotification = {
    ...notification,
    metatags: {
      ...notification?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedNotification);

  return deletedResult?.modifiedCount;
};

const notificationModel = model<INotification, INotificationModel>(
  'Notification',
  notificationsSchema,
);
export default notificationModel;
