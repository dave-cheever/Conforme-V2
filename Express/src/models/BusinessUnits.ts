import { model, Schema } from "mongoose";

import { IBusinessUnit } from "app-interfaces";
import { IBusinessUnitModel } from "src/interfaces/IBusinessUnitModel";

const businessUnitSchema  = new Schema<IBusinessUnit, IBusinessUnitModel>({
  _id: String,
  identifier: String,
  name: String,
  type: String,
  region: String,
  identifiers: [{
    system: String,
    value: String,
  }],
  imgUrl : String,
  communications: [{type: String, value : String}],
  address: {
    lineOne: String,
    city: String,   
    county: String,
    postcode: String,
    country: String,
  },
  ed: {
    firstName: String,
    lastName: String,
    email: String,
    id: String,
  },
  rd:  {
    firstName: String,
    lastName: String,
    email: String,
    id: String,
  },
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
      },
})

businessUnitSchema.statics.getById = async function (
    _id: string
  ): Promise<IBusinessUnit> {
    const businessUnit = await this.findOne({
      _id,
      "metatags.removedAt": { $eq: null },
    });
    if (!businessUnit) {
      throw new Error("Business Unit not found");
    }
    return businessUnit;
  };
  
  businessUnitSchema.statics.get = async function (
    selector: any = {}
  ): Promise<IBusinessUnit[]> {
    const businessUnits = await this.find({
      ...selector,
      "metatags.removedAt": { $eq: null },
    });
    return businessUnits;
  };
  
  const businessModel = model<IBusinessUnit, IBusinessUnitModel>("BusinessUnit", businessUnitSchema, 'businessUnits');
  export default businessModel;


