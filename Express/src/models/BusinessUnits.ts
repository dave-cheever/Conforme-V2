import { model, Schema } from "mongoose";

import { IBusinessUnit } from "app-interfaces";
import { IBusinessUnitModel } from "src/interfaces/IBusinessUnitModel";

const businessUnitSchema = new Schema<IBusinessUnit, IBusinessUnitModel>({
  _id: String,
  identifier: String,
  name: String,
  type: String,
  region: String,
  ownerId: String,
  imgUrl: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
}, { typeKey: '$type' })

businessUnitSchema.statics.customFindById = async function (_id: string): Promise<IBusinessUnit> {
  const businessUnit = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!businessUnit) {
    throw new Error("Business Unit not found");
  }
  return businessUnit;
};

businessUnitSchema.statics.customFind = async function (selector: any = {}): Promise<IBusinessUnit[]> {
  const businessUnits = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return businessUnits;
};

const businessModel = model<IBusinessUnit, IBusinessUnitModel>("BusinessUnit", businessUnitSchema, 'businessUnits');
export default businessModel;


