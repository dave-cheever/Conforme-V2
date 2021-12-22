import { model, Schema } from 'mongoose';

import { IBaseWithName, IBaseWithNameModel } from 'app-interfaces';

const regulatoryBodySchema = new Schema<IBaseWithName, IBaseWithNameModel>({
  _id: String,
  name: String,
  organizationId: String,
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

regulatoryBodySchema.statics.customFindById = async function (_id: string): Promise<IBaseWithName> {
  const regulatoryBody = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!regulatoryBody) {
    throw new Error('Regulatory body not found');
  }
  return regulatoryBody;
}

regulatoryBodySchema.statics.customFind = async function (selector: any = {}, organizationId): Promise<IBaseWithName[]> {
  const regulatoryBodies = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return regulatoryBodies;
}

const regulatoryBodyModel = model<IBaseWithName, IBaseWithNameModel>('RegulatoryBody', regulatoryBodySchema, 'regulatoryBodies');
export default regulatoryBodyModel;
