import { model, Schema } from 'mongoose';

import { IAnswer } from '../../interfaces/IAnswer';
import { IAnswerModel } from '../../interfaces/IAnswerModel';

const answersSchema = new Schema<IAnswer, IAnswerModel>({
  _id: String,
  questionId: String,
  answer: Schema.Types.Mixed,
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date
    }
  ],
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed']
  },
  options: {
    type: Map,
    of: Boolean
  },
  scope: {
    component: {
      type: String,
      enum: ['audits', 'tracker']
    },
    type: {
      type: String
    },
    _id: String
  },
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

answersSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string
): Promise<IAnswer[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return answers;
};

answersSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<IAnswer | null> {
  const answer = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null }
  }).lean();
  return answer;
};

answersSchema.statics.customFindById = async function (_id: string): Promise<IAnswer> {
  const answer = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null }
  }).lean();
  if (!answer) throw new Error('Answer not found');

  return answer;
};

const answersModel = model<IAnswer, IAnswerModel>('Answer', answersSchema, 'answers');

export default answersModel;
