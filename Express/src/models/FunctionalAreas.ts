import { model, Schema } from "mongoose";

import { IBaseWithName, IBaseWithNameModel } from "app-interfaces";

const functionalAreaSchema = new Schema<IBaseWithName, IBaseWithNameModel>({
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

functionalAreaSchema.statics.getById = async function (
  _id: string
): Promise<IBaseWithName> {
  const functionalArea = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!functionalArea) {
    throw new Error("Functional Area not found");
  }
  return functionalArea._doc;
};

functionalAreaSchema.statics.get = async function (
  selector: any = {}
): Promise<IBaseWithName[]> {
  const functionalAreas = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return functionalAreas.map((functionalArea) => functionalArea._doc);
};

const functionalAreaModel = model<IBaseWithName, IBaseWithNameModel>("FunctionalArea", functionalAreaSchema, 'functionalAreas');
export default functionalAreaModel;
