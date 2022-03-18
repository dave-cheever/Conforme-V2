import { model, models, Schema } from "mongoose";
import { GraphQLError } from "graphql";
import { v4 as uuidv4 } from "uuid";

import { IBaseWithName, IBaseWithNameModel } from "app-interfaces";
import { AuditLogs } from "app-models";
import { genMetatags, getAuditRecordValues, getBasicElement, removeDatabaseFields } from "app-utils";

const categorySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: {
    type: String,
    validate: [validateUniqueName, "Category name already exists"]
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

//custom validation for unique name
async function validateUniqueName(this: any, name: string) {
  const categoryCount = await models.Category.find({
    name,
    "metatags.removedAt": { $eq: null },
  }).count()
  return !categoryCount
}

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

categorySchema.statics.customCreate = async function (category: IBaseWithName, userId: string, organizationId: string): Promise<IBaseWithName> {
  const createdCategory = await this.create({
    ...category,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId),
  });


  if (createdCategory?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdCategory._doc);
      const newValues = removeDatabaseFields(createdCategory._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit({
        coll: 'categories',
        action: "add",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return createdCategory;
};

categorySchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IBaseWithName[]> {
  const categories = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return categories;
};

categorySchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IBaseWithName | null> {
  const category = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return category;
};

categorySchema.statics.customFindById = async function (_id: string): Promise<IBaseWithName> {
  const category = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

categorySchema.statics.customUpdateOne = async function (selector: object = {}, updates: Partial<IBaseWithName>, userId: string, organizationId: string): Promise<IBaseWithName> {
  const category = await this.customFindOne(selector, organizationId);
  if (!category) {
    throw new GraphQLError('Category doesn\'t exist');
  }

  const updatedCategory = {
    ...category,
    ...updates,
    metatags: {
      ...category?.metatags,
      ...genMetatags("updated", userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedCategory);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedCategory);
      const oldValues = removeDatabaseFields(category);
      const newValues = removeDatabaseFields(updatedCategory);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit({
        coll: 'categories',
        action: "update",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return updatedCategory;
};

categorySchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const category = await this.customFindOne(selector, organizationId);
  if (!category) {
    throw new GraphQLError('Category doesn\'t exist');
  }

  const updatedCategory = {
    ...category,
    metatags: {
      ...category?.metatags,
      ...genMetatags("removed", userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedCategory);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(category);
      const oldValues = removeDatabaseFields(category);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit({
        coll: 'categories',
        action: "delete",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

const categoryModel = model<IBaseWithName, IBaseWithNameModel>("Category", categorySchema);
export default categoryModel;
