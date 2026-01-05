import { GraphQLError } from 'graphql';
import { model, models, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IBaseWithName, IBaseWithNameModel } from 'app-interfaces';
import { ActionTemplates } from 'app-models';
import { genMetatags } from 'app-utils';

async function validateUniqueName(this: any, name: string) {
  const query: any = {
    name: name.trim(),
    organizationId: this.organizationId,
    'metatags.removedAt': { $eq: null },
  };
  
  // Exclude current document when updating
  if (this._id) {
    query._id = { $ne: this._id };
  }
  
  const actionCategoryCount = await models.ActionCategory.countDocuments(query);
  return actionCategoryCount === 0;
}

const actionCategoriesSchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: {
    type: String,
    required: true,
    validate: [validateUniqueName, 'Category name must be unique'],
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

actionCategoriesSchema.statics.customCreate = async function (
  actionCategory: IBaseWithName,
  userId: string,
  organizationId: string,
): Promise<IBaseWithName> {
  const trimmedName = actionCategory.name?.trim();
  if (!trimmedName) {
    throw new GraphQLError('Category name is required');
  }

  const existingCategory = await this.findOne({
    name: trimmedName,
    organizationId,
    'metatags.removedAt': { $eq: null },
  });

  if (existingCategory) {
    throw new GraphQLError('Category name must be unique');
  }

  const createdActionCategory = await this.create({
    ...actionCategory,
    name: trimmedName,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  return createdActionCategory;
};

actionCategoriesSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IBaseWithName[]> {
  const actionCategories = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return actionCategories;
};

actionCategoriesSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IBaseWithName | null> {
  const actionCategory = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return actionCategory;
};

actionCategoriesSchema.statics.customFindById = async function (
  _id: string,
): Promise<IBaseWithName> {
  const actionCategory = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!actionCategory) throw new Error('Action category not found');

  return actionCategory;
};

actionCategoriesSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IBaseWithName>,
  userId: string,
  organizationId: string,
): Promise<IBaseWithName> {
  const actionCategory = await this.customFindOne(selector, organizationId);
  if (!actionCategory) throw new GraphQLError("Action category doesn't exist");

  let trimmedUpdates = { ...updates };
  if (updates.name !== undefined) {
    const trimmedName = updates.name.trim();
    if (!trimmedName) {
      throw new GraphQLError('Category name is required');
    }

    const existingCategory = await this.findOne({
      name: trimmedName,
      organizationId,
      _id: { $ne: actionCategory._id },
      'metatags.removedAt': { $eq: null },
    });

    if (existingCategory) {
      throw new GraphQLError('Category name must be unique');
    }

    trimmedUpdates.name = trimmedName;
  }

  const updatedActionCategory = {
    ...actionCategory,
    ...trimmedUpdates,
    metatags: {
      ...actionCategory?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  await this.updateOne(selector, updatedActionCategory);

  return updatedActionCategory;
};

actionCategoriesSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const actionCategory = await this.customFindOne(selector, organizationId);
  if (!actionCategory) throw new GraphQLError("Action category doesn't exist");

  // Check if action category is in use by action templates
  const actionTemplatesUsingCategory = await ActionTemplates.customFind(
    {
      actionCategoryId: actionCategory._id,
    },
    organizationId,
  );

  if (actionTemplatesUsingCategory.length > 0) {
    const templateCount = actionTemplatesUsingCategory.length;
    const templateText = templateCount === 1 ? 'action template' : 'action templates';
    
    throw new GraphQLError(
      `Cannot delete action category "${actionCategory.name}" because it is currently in use by ${templateCount} ${templateText}.`,
    );
  }

  const updatedActionCategory = {
    ...actionCategory,
    metatags: {
      ...actionCategory?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedActionCategory);

  return deletedResult?.modifiedCount;
};

const actionCategoryModel = model<IBaseWithName, IBaseWithNameModel>(
  'ActionCategory',
  actionCategoriesSchema,
  'actionCategories',
);
export default actionCategoryModel;

