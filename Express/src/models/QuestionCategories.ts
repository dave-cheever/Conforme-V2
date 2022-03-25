import { model, Schema } from 'mongoose';
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';

import { IQuestionCategory, IQuestionCategoryModel } from 'app-interfaces';
import { AuditLogs } from 'app-models';
import {
  genMetatags,
  getAuditRecordValues,
  getBasicElement,
  removeDatabaseFields
} from 'app-utils';

const questionCategoriesSchema = new Schema<IQuestionCategory, IQuestionCategoryModel>({
  _id: String,
  name: String,
  auditType: String,
  withAnswers: Boolean,
  allowCustomQuestions: Boolean,
  maxQuestionsNumber: Number,
  scope: {
    component: {
      type: String,
      enum: ['audits', 'tracker']
    },
    type: {
      type: String
    },
    _id: String
  },
  organizationId: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

questionCategoriesSchema.statics.customCreate = async function (
  questionCategory: IQuestionCategory,
  userId: string,
  organizationId: string
): Promise<IQuestionCategory> {
  const createdQuestionCategory = await this.create({
    ...questionCategory,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId)
  });

  return createdQuestionCategory;
};

questionCategoriesSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string
): Promise<IQuestionCategory[]> {
  const questionsCategories = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return questionsCategories;
};

questionCategoriesSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<IQuestionCategory | null> {
  const questionCategory = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return questionCategory;
};

questionCategoriesSchema.statics.customFindById = async function (
  _id: string
): Promise<IQuestionCategory> {
  const questionCategory = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null }
  }).lean();
  if (!questionCategory) {
    throw new Error('Question category not found');
  }
  return questionCategory;
};

questionCategoriesSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IQuestionCategory>,
  userId: string,
  organizationId: string
): Promise<IQuestionCategory> {
  const questionCategory = await this.customFindOne(selector, organizationId);
  if (!questionCategory) {
    throw new GraphQLError("Question category doesn't exist");
  }

  const updatedQuestion = {
    ...questionCategory,
    ...updates,
    metatags: {
      ...questionCategory?.metatags,
      ...genMetatags('updated', userId)
    }
  };
  const updatedResult = await this.updateOne(selector, updatedQuestion);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(questionCategory);
      const newValues = removeDatabaseFields(updatedQuestion);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'questionCategories',
          action: 'update',
          element: {
            _id: questionCategory._id,
            name: questionCategory.name
          },
          values
        },
        userId,
        organizationId
      );
    };
    addAuditLog();
  }

  return updatedQuestion;
};

questionCategoriesSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string
): Promise<number> {
  const questionCategory = await this.customFindOne(selector, organizationId);
  if (!questionCategory) {
    throw new GraphQLError("Question category doesn't exist");
  }

  const updatedQuestionCategory = {
    ...questionCategory,
    metatags: {
      ...questionCategory?.metatags,
      ...genMetatags('removed', userId)
    }
  };
  const deletedResult = await this.updateOne(selector, updatedQuestionCategory);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(questionCategory);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'questionCategories',
          action: 'delete',
          element: {
            _id: questionCategory._id,
            name: questionCategory.name
          },
          values
        },
        userId,
        organizationId
      );
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

const questionCategoryModel = model<IQuestionCategory, IQuestionCategoryModel>(
  'QuestionCategory',
  questionCategoriesSchema
);
export default questionCategoryModel;
