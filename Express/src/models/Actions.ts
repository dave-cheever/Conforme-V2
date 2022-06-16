import { format } from 'date-fns';
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAction, IActionModel, IOrganization } from 'app-interfaces';
import { Answers, Audits, Notifications, Users } from 'app-models';
import { ACTION_ASSIGNED, ACTION_COMPLETED } from 'app-shared';
import { genMetatags } from 'app-utils';

const actionsSchema = new Schema<IAction, IActionModel>({
  _id: String,
  title: String,
  dueDate: Date,
  completedDate: Date,
  done: Boolean,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
  },
  description: String,
  assigneeId: String,
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date,
    },
  ],
  scope: {
    module: {
      type: String,
      enum: ['audits', 'tracker'],
    },
    moduleId: String,
    type: {
      type: String,
    },
    _id: String,
  },
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

actionsSchema.statics.customCreate = async function (action: IAction, userId: string, organizationId: string): Promise<IAction> {
  const createdAction = await this.create({
    ...action,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdAction;
};

actionsSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAction[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answers;
};

actionsSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IAction | null> {
  const action = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return action;
};

actionsSchema.statics.customFindById = async function (_id: string): Promise<IAction> {
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
    completedDate: updates.done ? new Date() : undefined,
    metatags: {
      ...action?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  await this.updateOne(selector, updatedAction);

  return updatedAction;
};

actionsSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
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

actionsSchema.statics.customAssertAssignee = async function (actionId: string): Promise<void> {
  const action = await this.findById(actionId).lean();
  if (!action) return;

  // If action was created in an answer, in an audit, add assignee as participant
  if (action.scope.type === 'answer' && action.assigneeId) {
    const actionAnswer = await Answers.aggregate([
      {
        $match: {
          _id: action.scope._id,
          'scope.type': 'audit',
        },
      },
      {
        $lookup: {
          from: 'audits',
          localField: 'scope._id',
          foreignField: '_id',
          as: 'audit',
        },
      },
      {
        $unwind: {
          path: `$audit`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    if (!actionAnswer) return;

    const auditId = actionAnswer?.[0]?.audit?._id;
    if (!auditId) return;

    const participantsIds = actionAnswer?.[0]?.audit?.participantsIds || [];
    const auditorId = actionAnswer?.[0]?.audit?.auditorId;
    if (auditorId === action.assigneeId || participantsIds.includes(action.assigneeId)) return;
    await Audits.updateOne({ _id: actionAnswer?.[0]?.audit._id }, { participantsIds: [...participantsIds, action.assigneeId] });
  }
};

actionsSchema.statics.customAssigneeNotification = async function (actionId: string, organization: IOrganization): Promise<void> {
  const action = await this.findById(actionId).lean();
  if (!action || !action.assigneeId) return;

  const module = organization.modules.find(({ _id }) => _id === action.scope.moduleId);
  let actionPath = '';

  // If action was created in an answer, in an audit, 
  if (action.scope?._id && action.scope?.type === 'answer') {
    const answer = await Answers.customFindOne({ _id: action.scope._id, 'scope.type': 'audit' }, organization._id);
    if (module && answer) actionPath = `/${module.path}/audits/${answer.scope._id}`;
  }

  // If there is no action path, do not send the notification
  if (actionPath) {
    const assignee = await Users.customFindByIdWithDetails({ userId: action.assigneeId, organization });
    await Notifications.customCreate(
      {
        emailType: ACTION_ASSIGNED,
        emailData: {
          actionTitle: action.title,
          actionPath,
          actionDueDate: action.dueDate ? `Due ${format(new Date(action.dueDate), 'd LLLL Y')}` : 'No due date',
        },
        status: 'pending',
        to: [assignee?.email],
      },
      action.metatags.updatedBy || action.metatags.addedBy,
      organization._id,
    );
  }
};

actionsSchema.statics.customCompletedNotification = async function (actionId: string, organization: IOrganization): Promise<void> {
  const action = await this.findById(actionId).lean();
  if (!action || !action.done) return;

  const module = organization.modules.find(({ _id }) => _id === action.scope.moduleId);
  let actionPath = '';
  const recipients: string[] = [];

  if (action.assigneeId) {
    const assignee = await Users.customFindByIdWithDetails({ userId: action.assigneeId, organization });
    if (assignee) recipients.push(assignee.email);
  }

  // If action was created in an answer, in an audit, 
  if (action.scope?._id && action.scope?.type === 'answer') {
    const answers = await Answers.aggregate([
      {
        $match: {
          $and: [
            {
              'metatags.removedAt': { $eq: null },
            },
            {
              _id: action.scope._id,
              'scope.type': 'audit',
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'audits',
          localField: 'scope._id',
          foreignField: '_id',
          as: 'audit',
        },
      },
      {
        $unwind: {
          path: `$audit`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    const answer = answers[0];
    if (module && answer) actionPath = `/${module.path}/audits/${answer.scope._id}`;

    const auditor = await Users.customFindByIdWithDetails({
      userId: answer?.audit.auditorId,
      organization,
    });
    if (auditor) recipients.push(auditor.email);
  }

  // If there is no action path or no receivers, do not send the notification
  if (actionPath && recipients.length > 0) {
    await Notifications.customCreate(
      {
        emailType: ACTION_COMPLETED,
        emailData: {
          actionTitle: action.title,
          actionPath,
        },
        status: 'pending',
        to: recipients,
      },
      action.metatags.updatedBy || action.metatags.addedBy,
      organization._id,
    );
  }
};

const actionsModel = model<IAction, IActionModel>('Action', actionsSchema, 'actions');

export default actionsModel;
