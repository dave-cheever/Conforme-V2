import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IQuestionsCategory, IQuestionsCategoryModel } from 'app-interfaces';
import { AuditLogs } from 'app-models';
import {
  genMetatags,
  getAuditRecordValues,
  removeDatabaseFields,
} from 'app-utils';

const questionsCategoriesSchema = new Schema<
  IQuestionsCategory,
  IQuestionsCategoryModel
>({
  _id: String,
  name: String,
  auditType: String,
  navigationDisplay: Boolean,
  withAnswers: Boolean,
  allowCustomQuestions: Boolean,
  maxQuestionsNumber: Number,
  icon: String,
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

questionsCategoriesSchema.statics.customCreate = async function (
  questionCategory: IQuestionsCategory,
  userId: string,
  organizationId: string,
): Promise<IQuestionsCategory> {
  const createdQuestionCategory = await this.create({
    ...questionCategory,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdQuestionCategory;
};

questionsCategoriesSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IQuestionsCategory[]> {
  const questionsCategories = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return questionsCategories;
};

questionsCategoriesSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IQuestionsCategory | null> {
  const questionCategory = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return questionCategory;
};

questionsCategoriesSchema.statics.customFindById = async function (
  _id: string,
): Promise<IQuestionsCategory> {
  const questionCategory = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!questionCategory) throw new Error('Question category not found');

  return questionCategory;
};

questionsCategoriesSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IQuestionsCategory>,
  userId: string,
  organizationId: string,
): Promise<IQuestionsCategory> {
  const questionCategory = await this.customFindOne(selector, organizationId);
  if (!questionCategory)
    throw new GraphQLError("Question category doesn't exist");

  const updatedQuestion = {
    ...questionCategory,
    ...updates,
    metatags: {
      ...questionCategory?.metatags,
      ...genMetatags('updated', userId),
    },
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
            name: questionCategory.name,
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

questionsCategoriesSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const questionCategory = await this.customFindOne(selector, organizationId);
  if (!questionCategory)
    throw new GraphQLError("Question category doesn't exist");

  const updatedQuestionCategory = {
    ...questionCategory,
    metatags: {
      ...questionCategory?.metatags,
      ...genMetatags('removed', userId),
    },
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
            name: questionCategory.name,
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

const questionsCategoryModel = model<
  IQuestionsCategory,
  IQuestionsCategoryModel
>('QuestionsCategory', questionsCategoriesSchema, 'questionsCategories');
export default questionsCategoryModel;
