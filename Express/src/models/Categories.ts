import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IBaseWithName, IBaseWithNameModel } from "app-interfaces";
import { AuditLogs } from "app-models";
import { genMetatags } from "app-utils";

const CategorySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: String,
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

CategorySchema.statics.customFindById = async function (_id: string): Promise<IBaseWithName> {
  const category = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!category) {
    throw new Error("Category not found");
  }
  return category;
};

CategorySchema.statics.customFind = async function (selector: any = {}, organizationId): Promise<IBaseWithName[]> {
  const categories = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return categories;
};

CategorySchema.statics.customUpdateOne = async function (selector: any = {}, updatedObject: IBaseWithName, userId: string): Promise<number> {
  const updatedCategory = await this.updateOne(selector, updatedObject);
  AuditLogs.customCreate({
    _id: uuidv4(),
    coll: 'categories',
    action: "add",
    element: {
      _id: updatedObject._id,
      name: updatedObject.name,
    },
    values: {
      name: {
        new: {
          label: updatedObject.name,
          value: updatedObject.name,
        },
      }
    },
    metatags: genMetatags("added", userId) as { addedBy: string; addedAt: Date },
  }, userId);
  return updatedCategory.modifiedCount;
};

const categoryModel = model<IBaseWithName, IBaseWithNameModel>("Category", CategorySchema);
export default categoryModel;
