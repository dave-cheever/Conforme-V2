import { model, Schema } from "mongoose";

import { IBaseWithName } from "app-interfaces";
import { IBaseWithNameModel } from "src/interfaces/IBaseWithNameModel";

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

CategorySchema.statics.getById = async function (
  _id: string
): Promise<IBaseWithName> {
  const category = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!category) {
    throw new Error("Category not found");
  }
  return category._doc;
};

CategorySchema.statics.get = async function (
  selector: any = {}
): Promise<IBaseWithName[]> {
  const categories = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return categories.map((category) => category._doc);
};

const categoryModel = model<IBaseWithName, IBaseWithNameModel>(
  "Category",
  CategorySchema
);
export default categoryModel;
