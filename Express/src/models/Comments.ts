
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAudit, IComment, ICommentModel, IComplianceItem, IOrganization, IResponse } from 'app-interfaces';
import { AuditLogs, Audits, ComplianceItems, Notifications, Responses, Users } from 'app-models';
import { MENTION_NOTIFICATION } from 'app-shared';
import {
  genMetatags,
  getAuditRecordValues,
  getForeignElement,
  removeDatabaseFields,
} from 'app-utils';

const commentSchema = new Schema<IComment, ICommentModel>({
  _id: String,
  componentId: String,
  text: String,
  authorId: String,
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

commentSchema.statics.customCreate = async function (
  comment: IComment,
  userId: string,
  organizationId: string,
): Promise<IComment> {
  const createdComment = await this.create({
    ...comment,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdComment?._doc) {
    const addAuditLog = async () => {
      let componentData: IResponse | IAudit = {} as IResponse | IAudit;
      let complianceItem: IComplianceItem = {} as IComplianceItem

      if (comment.scope.type === 'tracker') componentData = await Responses.customFindById(comment.componentId, organizationId);
      if (comment.scope.type === 'audits') componentData = await Audits.customFindById(comment.componentId, organizationId);
      if (comment.scope.type === 'tracker') complianceItem = await ComplianceItems.customFindById(componentData["complianceItemId"], organizationId);

      const element = getForeignElement(
        { _id: componentData._id, name: comment.scope.type === 'tracker' ? complianceItem.name : componentData['reference'] },
        createdComment._doc._id,
      );
      const newValues = removeDatabaseFields(createdComment._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'comments',
          action: 'add',
          element,
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }
  return createdComment;
};

commentSchema.statics.customFind = async function (
  _id: string,
): Promise<IComment[]> {
  const comments = await this.find({
    responseId: _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return comments;
};

commentSchema.statics.customFindById = async function (
  _id: string,
): Promise<IComment> {
  const comment = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!comment)
    throw new Error('Comment not found');

  return comment;
};

commentSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IComment | null> {
  const comment = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return comment;
};

commentSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const comment = await this.customFindOne(selector, organizationId);
  if (!comment)
    throw new GraphQLError("Comment doesn't exist");

  const updatedComment = {
    ...comment,
    metatags: {
      ...comment?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedComment);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      let componentData: IResponse | IAudit = {} as IResponse | IAudit;
      let complianceItem: IComplianceItem = {} as IComplianceItem

      if (comment.scope.type === 'tracker') componentData = await Responses.customFindById(comment.componentId, organizationId);
      if (comment.scope.type === 'audits') componentData = await Audits.customFindById(comment.componentId, organizationId);
      if (comment.scope.type === 'tracker' && componentData["complianceItemId"]) complianceItem =
        await ComplianceItems.customFindById(componentData["complianceItemId"], organizationId);

      const element = getForeignElement(
        { _id: componentData._id, name: comment.scope.type === 'tracker' ? complianceItem.name : componentData['reference'] }, comment._id,
      );

      const oldValues = removeDatabaseFields(comment);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'comments',
          action: 'delete',
          element,
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

commentSchema.statics.sendMentionedEmail = async function (userId: string, organization: IOrganization, comment: IComment): Promise<void> {
  const user = await Users.findById(userId).lean();
  const module = organization.modules.find(({ _id }) => _id === comment.scope?.moduleId);
  await Notifications.customCreate(
    {
      emailType: MENTION_NOTIFICATION,
      emailData: {
        message: comment.text,
        mentionedUser: user?.displayName || '',
        template: 'MentionedNotificationEmailTemplate',
      },
      to: [user?.email!],
      status: 'pending',
      scope: {
        moduleId: module?._id,
      },
    },
    comment.metatags.updatedBy || comment.metatags.addedBy,
    organization._id,
  );
};

const commentModel = model<IComment, ICommentModel>('Comment', commentSchema);
export default commentModel;
