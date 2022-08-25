import { model, Schema } from "mongoose";
import { IResponse } from "../../interfaces/IResponse";
import { IResponseModel } from "../../interfaces/IResponseModel";

const responseSchema = new Schema<IResponse, IResponseModel>({
  _id: String,
  trackerItemId: String,
  businessUnitId: String,
  accountableId: String,
  responsibleId: String,
  contributorsIds: [String],
  followersIds: [String],
  lastCompletionDate: Date,
  dueDate: Date,
  status: String,
  published: Boolean,
  evidence: [
    {
      _id: false,
      name: String,
      uploaded: {
        id: String,
        name: String,
        addedAt: Date,
      },
      outdated: Boolean,
    },
  ],
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date,
    },
  ],
  questions: [
    {
      _id: false,
      type: {
        type: String,
        enum: [
          'text',
          'textMultiline',
          'switch',
          'datepicker',
          'multipleChoice',
          'singleChoice',
          'url',
        ],
      },
      name: String,
      description: String,
      value: Schema.Types.Mixed,
      required: Boolean,
      outdated: Boolean,
      requiredAnswer: Schema.Types.Mixed,
      notApplicable: Boolean,
      options: [{
        label: String,
        value: String,
      }],
    },
  ],
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

responseSchema.statics.customFind = async function (
  selector: any = {}
): Promise<IResponse[]> {
  const responses = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return responses;
};

responseSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<IResponse | null> {
  const response = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return response;
};

responseSchema.statics.customFindById = async function (
  _id: string
): Promise<IResponse> {
  const response = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!response) throw new Error("Response not found");

  return response;
};

const responseModel = model<IResponse, IResponseModel>(
  "Response",
  responseSchema
);
export default responseModel;
