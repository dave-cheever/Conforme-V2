import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IQuestion, IQuestionModel, TQuestionValue } from 'app-interfaces';
import { AuditLogs } from 'app-models';
import {
  genMetatags,
  getAuditRecordValues,
  removeDatabaseFields,
} from 'app-utils';

const questionsSchema = new Schema<IQuestion<TQuestionValue>, IQuestionModel>({
  _id: String,
  type: {
    type: String,
    enum: ['text', 'textMultiline', 'switch', 'datepicker', 'multipleChoice'],
  },
  question: String,
  description: String,
  questionsCategoryId: String,
  required: Boolean,
  notApplicable: Boolean,
  positiveValue: Schema.Types.Mixed,
  negativeValue: Schema.Types.Mixed,
  scope: {
    component: {
      type: String,
      enum: ['audits', 'tracker'],
    },
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

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

questionsSchema.statics.customCreate = async function (
  question: IQuestion<TQuestionValue>,
  userId: string,
  organizationId: string,
): Promise<IQuestion<TQuestionValue>> {
  const createdQuestion = await this.create({
    ...question,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  // if (createdQuestion?._doc) {
  //   const addAuditLog = async () => {
  //     const newValues = removeDatabaseFields(createdQuestion._doc);
  //     const values = await getAuditRecordValues({ newValues });
  //     AuditLogs.customAudit({
  //       coll: 'questions',
  //       action: "add",
  //       element: {
  //         _id: createdQuestion._id,
  //         name: question.question,
  //       },
  //       values,
  //     }, userId, organizationId);
  //   };
  //   addAuditLog();
  // }

  return createdQuestion;
};

questionsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IQuestion<TQuestionValue>[]> {
  const questions = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return questions;
};

questionsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IQuestion<TQuestionValue> | null> {
  const question = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return question;
};

questionsSchema.statics.customFindById = async function (
  _id: string,
): Promise<IQuestion<TQuestionValue>> {
  const question = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!question) throw new Error('Question not found');

  return question;
};

questionsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IQuestion<TQuestionValue>>,
  userId: string,
  organizationId: string,
): Promise<IQuestion<TQuestionValue>> {
  const question = await this.customFindOne(selector, organizationId);
  if (!question) throw new GraphQLError("Question doesn't exist");

  const updatedQuestion = {
    ...question,
    ...updates,
    metatags: {
      ...question?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedQuestion);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(question);
      const newValues = removeDatabaseFields(updatedQuestion);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'questions',
          action: 'update',
          element: {
            _id: question._id,
            name: question.question,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return updatedQuestion;
};

questionsSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const question = await this.customFindOne(selector, organizationId);
  if (!question) throw new GraphQLError("Question doesn't exist");

  const updatedQuestion = {
    ...question,
    metatags: {
      ...question?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedQuestion);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(question);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'questions',
          action: 'delete',
          element: {
            _id: question._id,
            name: question.question,
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

const questionModel = model<IQuestion<TQuestionValue>, IQuestionModel>(
  'Question',
  questionsSchema,
);
export default questionModel;
