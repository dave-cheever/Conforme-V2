import { model, Schema } from 'mongoose';

import { IBaseWithName, IResponse, IResponseModel } from 'app-interfaces';

const responseSchema = new Schema<IResponse, IResponseModel>({
  _id: String,
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

responseSchema.statics.get = async function (
  selector: any = {}
): Promise<IBaseWithName[]> {
  const responses = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return responses.map((response) => response._doc);
};

const responseModel = model<IResponse, IResponseModel>('Response', responseSchema);
export default responseModel;
