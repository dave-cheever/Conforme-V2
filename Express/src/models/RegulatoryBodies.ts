import { model, Schema } from 'mongoose';

import { IBaseWithName, IBaseWithNameModel } from 'app-interfaces';

const regulatoryBodySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

regulatoryBodySchema.statics.getById = async function (_id: string): Promise<IBaseWithName> {
  const regulatoryBody = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!regulatoryBody) {
    throw new Error('Regulatory body not found');
  }
  return regulatoryBody._doc;
}

regulatoryBodySchema.statics.get = async function (selector: any = {}): Promise<IBaseWithName[]> {
  const regulatoryBodies = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return regulatoryBodies.map(regulatoryBody => regulatoryBody._doc);
}

const regulatoryBodyModel = model<IBaseWithName, IBaseWithNameModel>('RegulatoryBody', regulatoryBodySchema, 'regulatoryBodies');
export default regulatoryBodyModel;
