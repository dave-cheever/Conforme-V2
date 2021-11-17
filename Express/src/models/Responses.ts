import { model, Schema } from 'mongoose';

import { IBaseWithName, IResponse, IResponseModel } from 'app-interfaces';

const responseSchema = new Schema<IResponse, IResponseModel>({
  _id: String,
  complianceItemId: String,
  businessUnitId: String,
  delegateIds: [String],
  lastRenewalDate: Date,
  nextRenewalDate: Date,
  status: String,
  evidence: [{
    _id: false,
    name: String,
    uploaded: {
      id: String,
      name: String,
      addedAt: Date,
    },
    outdated: Boolean,
  }],
  attachments: [{
    _id: false,
    id: String,
    name: String,
    addedAt: Date,
  }],
  questions: [{
    _id: false,
    type: {
      type: String,
      enum: ['text', 'toggle', 'datePicker'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
  }],
  // published: Boolean,
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

responseSchema.statics.get = async function (selector: any = {}): Promise<IResponse[]> {
  const responses = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  });
  return responses.map((response) => response._doc);
};

responseSchema.statics.getById = async function (_id: string): Promise<IResponse> {
  const response = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  });
  if (!response) {
    throw new Error("Category not found");
  }
  return response._doc;
};

const responseModel = model<IResponse, IResponseModel>('Response', responseSchema);
export default responseModel;
