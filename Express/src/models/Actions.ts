import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAction, IActionModel } from 'app-interfaces';
import { genMetatags } from 'app-utils';

const actionsSchema = new Schema<IAction, IActionModel>({
  _id: String,
  title: String,
  auditId: String,
  dueDate: String,
  done: Boolean,
  priority: String,
  description: String,
  assignedId: String,
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

actionsSchema.statics.customCreate = async function (
  action: IAction,
  userId: string,
  organizationId: string,
): Promise<IAction> {
  const createdAnswer = await this.create({
    ...action,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdAnswer;
};

actionsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAction[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answers;
};

actionsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAction | null> {
  const action = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return action;
};

actionsSchema.statics.customFindById = async function (
  _id: string,
): Promise<IAction> {
  const action = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!action) throw new Error('Action not found');

  return action;
};

actionsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAction>,
  userId: string,
  organizationId: string,
): Promise<IAction> {
  const action = await this.customFindOne(selector, organizationId);
  if (!action) throw new GraphQLError("Action doesn't exist");

  const updatedAction = {
    ...action,
    ...updates,
    metatags: {
      ...action?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  await this.updateOne(selector, updatedAction);

  return updatedAction;
};

actionsSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const action = await this.customFindOne(selector, organizationId);
  if (!action) throw new GraphQLError("Action doesn't exist");

  const updatedAction = {
    ...action,
    metatags: {
      ...action?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAction);

  return deletedResult?.modifiedCount;
};

const actionsModel = model<IAction, IActionModel>(
  'Action',
  actionsSchema,
  'actions',
);

export default actionsModel;
