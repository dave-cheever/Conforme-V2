import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { difference } from 'lodash';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAnswer, IAnswerModel, IAuditValue, IAuditValues } from 'app-interfaces';
import { AuditLogs, Organizations } from 'app-models';
import { GraphService } from 'app-services';
import { genMetatags, getAuditValueForString, removeDatabaseFields } from 'app-utils';

const answersSchema = new Schema<IAnswer, IAnswerModel>({
  _id: String,
  questionId: String,
  answer: Schema.Types.Mixed,
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date,
    },
  ],
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
  },
  options: {
    type: Map,
    of: Boolean,
  },
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
const getAuditRecordValues = async ({
  oldValues = {},
  newValues = {},
}): Promise<IAuditValues> => {
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
      // If updated 'attachments' field, set value as evidence name and file name and label as file details
      case 'attachments': {
        const getAttachmentsPathsArray = (arr) =>
          arr.map(({ uploaded }) => uploaded?.path);
        const removedAttachments = difference(
          getAttachmentsPathsArray(oldValue || []),
          getAttachmentsPathsArray(newValue || []),
        ).filter(Boolean);
        if (removedAttachments.length > 0) {
          const document = oldValue.find(
            ({ uploaded }) => uploaded.path === removedAttachments[0],
          );
          value.old = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        const addedAttachments = difference(
          getAttachmentsPathsArray(newValue || []),
          getAttachmentsPathsArray(oldValue || []),
        ).filter(Boolean);
        if (addedAttachments.length > 0) {
          const document = newValue.find(
            ({ uploaded }) => uploaded.path === addedAttachments[0],
          );
          value.new = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        break;
      }

      default:
        if (typeof oldValue === 'string' || typeof newValue === 'string')
          value = getAuditValueForString(oldValue, newValue);
    }
    return {
      ...acc,
      [field]: value,
    };
  }, Promise.resolve({}));

  const auditRecordValues = await auditRecordValuesPromise;
  return auditRecordValues;
};

answersSchema.statics.customCreate = async function (
  answer: IAnswer,
  userId: string,
  organizationId: string,
): Promise<IAnswer> {
  const createdAnswer = await this.create({
    ...answer,
    _id: uuidv4(),
    status: 'open',
    organizationId,
    metatags: genMetatags('added', userId),
  });

  // Move attachments to right SP folder
  if (answer.attachments && answer.attachments.length) {
    const organization = await Organizations.customFindById(
      organizationId,
      organizationId,
    );
    answer.attachments?.forEach((attachment) => {
      GraphService.moveDocument(
        attachment.id,
        createdAnswer._id,
        attachment.name,
        organization,
      );
    });
  }

  if (createdAnswer?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdAnswer._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'add',
          element: {
            _id: createdAnswer._doc._id,
            name: createdAnswer._doc.answer,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdAnswer;
};

answersSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAnswer[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answers;
};

answersSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAnswer | null> {
  const answer = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answer;
};

answersSchema.statics.customFindById = async function (
  _id: string,
): Promise<IAnswer> {
  const answer = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!answer) throw new Error('Answer not found');

  return answer;
};

answersSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAnswer>,
  userId: string,
  organizationId: string,
): Promise<IAnswer> {
  const answer = await this.customFindOne(selector, organizationId);
  if (!answer) throw new GraphQLError("Answer doesn't exist");

  const updatedAnswer = {
    ...answer,
    ...updates,
    metatags: {
      ...answer?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedAnswer);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(answer);
      const newValues = removeDatabaseFields(updatedAnswer);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'update',
          element: {
            _id: updatedAnswer._id,
            name: updatedAnswer.answer as string,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return updatedAnswer;
};

answersSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const answer = await this.customFindOne(selector, organizationId);
  if (!answer) throw new GraphQLError("Answer doesn't exist");

  const updatedAnswer = {
    ...answer,
    metatags: {
      ...answer?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAnswer);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(answer);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'delete',
          element: {
            _id: answer._id,
            name: answer.answer as string,
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

const answersModel = model<IAnswer, IAnswerModel>(
  'Answer',
  answersSchema,
  'answers',
);

export default answersModel;
