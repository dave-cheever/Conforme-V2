import { format } from 'date-fns';
import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { difference } from 'lodash';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAction, IActionModel, IAuditValue, IAuditValues, IOrganization } from 'app-interfaces';
import { Answers, AuditLogs, Audits, Notifications, Organizations, Users } from 'app-models';
import { ACTION_ASSIGNED, ACTION_COMPLETED } from 'app-shared';
import {
  genMetatags,
  getAuditValueForDate,
  getAuditValueForString,
  getAuditValueForUser,
  removeDatabaseFields,
} from 'app-utils';

const actionsSchema = new Schema<IAction, IActionModel>({
  _id: String,
  title: String,
  dueDate: Date,
  completedDate: Date,
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'closed'],
  },
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

// This method is used to prepare values object for audit log
const getAuditRecordValues = async ({ oldValues = {}, newValues = {}, organization }): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value: IAuditValue = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      case 'dueDate':
      case 'completedDate':
        value = getAuditValueForDate(oldValue, newValue);
        break;

      // If updated 'assigneeId' field, set user's ID as value and full name as label
      case 'assigneeId':
        value = await getAuditValueForUser({
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'attachments' field, set value as attachments name and file name and label as file details
      case 'attachments': {
        const getAttachmentsPathsArray = (arr) => arr.map(({ uploaded }) => uploaded?.path);
        const removedAttachments = difference(getAttachmentsPathsArray(oldValue || []), getAttachmentsPathsArray(newValue || [])).filter(
          Boolean,
        );
        if (removedAttachments.length > 0) {
          const document = oldValue.find(({ uploaded }) => uploaded.path === removedAttachments[0]);
          value.old = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        const addedAttachments = difference(getAttachmentsPathsArray(newValue || []), getAttachmentsPathsArray(oldValue || [])).filter(
          Boolean,
        );
        if (addedAttachments.length > 0) {
          const document = newValue.find(({ uploaded }) => uploaded.path === addedAttachments[0]);
          value.new = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        break;
      }

      default:
        if (typeof oldValue === 'string' || typeof newValue === 'string') value = getAuditValueForString(oldValue, newValue);
    }
    return {
      ...acc,
      [field]: value,
    };
  }, Promise.resolve({}));

  const auditRecordValues = await auditRecordValuesPromise;
  return auditRecordValues;
};

actionsSchema.statics.customCreate = async function (action: IAction, userId: string, organizationId: string): Promise<IAction> {
  // Add assignee to the database if doesn't exist
  if (action.assigneeId) await Users.customAssertUser({ userId: action.assigneeId, organizationId });

  const createdAction = await this.create({
    ...action,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdAction?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdAction._doc);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'actions',
          action: 'add',
          element: {
            _id: createdAction._doc._id,
            name: createdAction._doc.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

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

  // Add assignee to the database if doesn't exist
  if (action.assigneeId) await Users.customAssertUser({ userId: action.assigneeId, organizationId });

  const updatedAction = {
    ...action,
    ...updates,
    completedDate: updates.status === 'closed' ? new Date() : undefined,
    metatags: {
      ...action?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedAction);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(action);
      const newValues = removeDatabaseFields(updatedAction);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ oldValues, newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'actions',
          action: 'update',
          element: {
            _id: updatedAction._id,
            name: updatedAction.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

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

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(action);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ oldValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'actions',
          action: 'delete',
          element: {
            _id: action._id,
            name: action.title,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

actionsSchema.statics.customAssertAssignee = async function (actionId: string): Promise<void> {
  const action = await this.findById(actionId).lean();
  if (!action || !action.assigneeId) return;

  // If action was created in an answer, in an audit, add assignee as participant
  if (action.scope.type === 'answer') {
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
    if (module && answer) actionPath = `${organization.domain}/${module.path}/audits/${answer.scope._id}`;
  }

  // If there is no action path, do not send the notification
  if (actionPath) {
    const assignee = await Users.customFindByIdWithDetails({ userId: action.assigneeId, organization });
    const assignor = await Users.customFindByIdWithDetails({ userId: action.metatags.updatedBy ?? action.metatags.addedBy, organization });
    await Notifications.customCreate(
      {
        emailType: ACTION_ASSIGNED,
        emailData: {
          actionTitle: action.title,
          actionPath,
          actionDueDate: action.dueDate ? `Due ${format(new Date(action.dueDate), 'd LLLL Y')}` : 'No due date',
          assignedBy: assignor.displayName,
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
  if (!action || action.status !== 'closed') return;

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
    if (module && answer) actionPath = `${organization.domain}/${module.path}/audits/${answer.scope._id}`;

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
