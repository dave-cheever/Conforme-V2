import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IBaseWithName, IBaseWithNameModel } from "app-interfaces";
import { AuditLogs } from "app-models";
import { genMetatags } from "app-utils";

const CategorySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: String,
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
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category._doc;
};

CategorySchema.statics.customFind = async function (selector: any = {}): Promise<IBaseWithName[]> {
  const categories = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return categories.map((category) => category._doc);
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
