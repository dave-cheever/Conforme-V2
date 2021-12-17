import { model, Schema } from 'mongoose';

import { IBaseWithName, IResponse, IResponseModel } from 'app-interfaces';
import { getNextRenewalDate, getPrevRenewalDate } from 'app-utils';
import { ComplianceItems } from 'app-models';

const responseSchema = new Schema<IResponse, IResponseModel>({
  _id: String,
  complianceItemId: String,
  businessUnitId: String,
  accountableId: String,
  responsibleId: String,
  contributorsIds: [String],
  followersIds: [String],
  lastRenewalDate: Date,
  nextRenewalDate: Date,
  status: String,
  published: Boolean,
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
      enum: ['text', 'switch', 'datepicker', 'multipleChoice'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
    choices: [{
      _id: false,
      label: String,
      isCorrect: Boolean
    }]
  }],
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

responseSchema.statics.customFind = async function (selector: any = {}): Promise<IResponse[]> {
  const responses = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return responses;
};

responseSchema.statics.customFindById = async function (_id: string): Promise<IResponse> {
  const response = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!response) {
    throw new Error("Response not found");
  }
  return response;
};

responseSchema.methods.customRecalculateResponse = async function (): Promise<void> {
  const complianceItem = await ComplianceItems.customFindById(this._doc.complianceItemId);

  const areRequiredQuestionsAnswered = this._doc.questions
    .filter(({ required, outdated }) => required && !outdated)
    .every(({ value }) => value || (typeof value === 'boolean' && value === false));
  const isEvidenceUploaded = this._doc.evidence
    .filter(({ outdated }) => !outdated)
    .every(({ uploaded }) => uploaded.id);
  const isResponseCompleted = areRequiredQuestionsAnswered && isEvidenceUploaded;

  // any change triggers inProgress status from notStarted
  let newStatus;
  if (this.status === 'notStarted') {
    newStatus = 'inProgress';
  }
  if (this.status === 'completed' && !isResponseCompleted) {
    newStatus = 'inProgress';
  }
  if (this.status !== 'completed' && isResponseCompleted) {
    newStatus = 'completed';
  }

  let nextRenewalDate = this.nextRenewalDate;
  if (this.status === 'completed' && newStatus === 'inProgress') {
    nextRenewalDate = getPrevRenewalDate(this.nextRenewalDate || new Date(), complianceItem.frequency);
  } else if ((this.status === 'completed' && newStatus) || newStatus === 'completed') {
    nextRenewalDate = getNextRenewalDate(this.nextRenewalDate || new Date(), complianceItem.frequency);
  }
  this.nextRenewalDate = nextRenewalDate;

  if (newStatus) {
    this.status = newStatus;
    if (newStatus === 'completed') {
      this.lastRenewalDate = new Date();
    }
  }
  await this.save();
}

const responseModel = model<IResponse, IResponseModel>('Response', responseSchema);
export default responseModel;
