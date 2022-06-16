import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAnswer, IAnswerModel } from 'app-interfaces';
import { Organizations } from 'app-models';
import { GraphService } from 'app-services';
import { genMetatags } from 'app-utils';

const answersSchema = new Schema<IAnswer, IAnswerModel>({
  _id: String,
  questionId: String,
  answer: Schema.Types.Mixed,
  attachments: [
    {
      _id: false,
      id: String,
      name: String,
      addedAt: Date,
    },
  ],
  status: {
    type: String,
    enum: ['open', 'resolved', 'closed'],
  },
  options: {
    type: Map,
    of: Boolean,
  },
  scope: {
    module: {
      type: String,
      enum: ['audits', 'tracker'],
    },
    moduleId: String,
    type: {
      type: String,
    },
    _id: String,
  },
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

answersSchema.statics.customCreate = async function (
  answer: IAnswer,
  userId: string,
  organizationId: string,
): Promise<IAnswer> {
  const createdAnswer = await this.create({
    ...answer,
    _id: uuidv4(),
    status: 'open',
    organizationId,
    metatags: genMetatags('added', userId),
  });

  // Move attachments to right SP folder
  if (answer.attachments && answer.attachments.length) {
    const organization = await Organizations.customFindById(
      organizationId,
      organizationId,
    );
    answer.attachments?.forEach((attachment) => {
      GraphService.moveDocument(
        attachment.id,
        createdAnswer._id,
        attachment.name,
        organization,
      );
    });
  }

  return createdAnswer;
};

answersSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAnswer[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answers;
};

answersSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAnswer | null> {
  const answer = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answer;
};

answersSchema.statics.customFindById = async function (
  _id: string,
): Promise<IAnswer> {
  const answer = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!answer) throw new Error('Answer not found');

  return answer;
};

answersSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAnswer>,
  userId: string,
  organizationId: string,
): Promise<IAnswer> {
  const answer = await this.customFindOne(selector, organizationId);
  if (!answer) throw new GraphQLError("Answer doesn't exist");

  const updatedAnswer = {
    ...answer,
    ...updates,
    metatags: {
      ...answer?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  await this.updateOne(selector, updatedAnswer);

  return updatedAnswer;
};

answersSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const answer = await this.customFindOne(selector, organizationId);
  if (!answer) throw new GraphQLError("Answer doesn't exist");

  const updatedAnswer = {
    ...answer,
    metatags: {
      ...answer?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAnswer);

  return deletedResult?.modifiedCount;
};

const answersModel = model<IAnswer, IAnswerModel>(
  'Answer',
  answersSchema,
  'answers',
);

export default answersModel;
