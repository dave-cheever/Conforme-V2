import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAuditValue, IAuditValues, IQuestionsCategory, IQuestionsCategoryModel } from 'app-interfaces';
import { AuditLogs } from 'app-models';
import {
  genMetatags,
  getAuditValueForBoolean,
  getAuditValueForString,
  getAuditValueForStringsArray,
  getBasicElement,
  removeDatabaseFields,
} from 'app-utils';

const questionsCategoriesSchema = new Schema<IQuestionsCategory, IQuestionsCategoryModel>({
  _id: String,
  name: String,
  withAnswers: Boolean,
  allowCustomQuestions: Boolean,
  maxQuestionsNumber: Number,
  notBlockedAfterCompletion: Boolean,
  useStatus: Boolean,
  showInInsights: Boolean,
  countInAuditCard: Boolean,
  icon: String,
  options: [
    {
      _id: false,
      type: {
        type: String,
        enum: ['notification'],
      },
      name: String,
      value: String,
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
const getAuditRecordValues = async ({ oldValues = {}, newValues = {} }): Promise<IAuditValues> => {
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
      case 'withAnswers':
      case 'allowCustomQuestions':
      case 'notBlockedAfterCompletion':
      case 'showInInsights':
      case 'countInAuditCard':
        value = getAuditValueForBoolean(oldValue, newValue);
        break;

      case 'maxQuestionsNumber':
        value = getAuditValueForString(oldValue, newValue);
        break;

      case 'options': {
        const getOptionsNamesArray = (arr) => arr.map(({ name }) => name);
        const oldNames = getOptionsNamesArray(oldValue || []);
        const newNames = getOptionsNamesArray(newValue || []);
        value = getAuditValueForStringsArray(oldNames, newNames);
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

  if (createdQuestionCategory?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdQuestionCategory._doc);
      const newValues = removeDatabaseFields(createdQuestionCategory._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'questionsCategories',
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

  return createdQuestionCategory;
};

questionsCategoriesSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IQuestionsCategory[]> {
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

questionsCategoriesSchema.statics.customFindById = async function (_id: string): Promise<IQuestionsCategory> {
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
  if (!questionCategory) throw new GraphQLError("Question category doesn't exist");

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
      const element = getBasicElement(updatedQuestion);
      const oldValues = removeDatabaseFields(questionCategory);
      const newValues = removeDatabaseFields(updatedQuestion);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'questionsCategories',
          action: 'update',
          element,
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
  if (!questionCategory) throw new GraphQLError("Question category doesn't exist");

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
      const element = getBasicElement(questionCategory);
      const oldValues = removeDatabaseFields(questionCategory);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'questionsCategories',
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

const questionsCategoryModel = model<IQuestionsCategory, IQuestionsCategoryModel>(
  'QuestionsCategory',
  questionsCategoriesSchema,
  'questionsCategories',
);
export default questionsCategoryModel;
