import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, PipelineStage, Schema } from 'mongoose';
import pluralize from 'pluralize';
import { v4 as uuidv4 } from 'uuid';

import { IAnswer, IAnswerModel, IAuditValue, IAuditValues } from 'app-interfaces';
import { AuditLogs, Notifications, Organizations, Questions, QuestionsCategories, Settings, Users } from 'app-models';
import { GraphService } from 'app-services';
import {
  genMetatags,
  getAuditValueForAttachments,
  getAuditValueForString,
  getProtocol,
  isPermitted,
  join,
  removeDatabaseFields,
} from 'app-utils';

import actionsModel from './Actions';

const answersSchema = new Schema<IAnswer, IAnswerModel>({
  _id: String,
  businessUnitId: String,
  questionId: String,
  answer: Schema.Types.Mixed,
  negativeValue: String,
  positiveValue:  String,
  notes: String,
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

// This method is used to prepare values object for audit log
const getAuditRecordValues = async ({ oldValues = {}, newValues = {} }): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value: IAuditValue = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      // If updated 'attachments' field, set value as evidence name and file name and label as file details
      case 'attachments': {
        value = getAuditValueForAttachments({ oldValue, newValue });
        break;
      }

      default:
        if (typeof oldValue === 'string' || typeof newValue === 'string') value = getAuditValueForString(oldValue, newValue);
    }
    return {
      ...acc,
      [field]: value,
    };
  }, Promise.resolve({}));

  const auditRecordValues = await auditRecordValuesPromise;
  return auditRecordValues;
};

answersSchema.statics.customCreate = async function (answer: IAnswer, userId: string, organizationId: string): Promise<IAnswer> {
  const createdAnswer = await this.create({
    ...answer,
    _id: uuidv4(),
    status: 'open',
    organizationId,
    metatags: genMetatags('added', userId),
  });

  const organization = await Organizations.customFindById(organizationId);

  // Move attachments to right SP folder
  if (answer.attachments && answer.attachments.length) {
    answer.attachments?.forEach((attachment) => {
      GraphService.moveDocument(attachment.id, createdAnswer._id, attachment.name, organization);
    });
  }

  // Set notifications if configured
  const sendNotifications = async () => {
    const question = await Questions.customFindById(answer.questionId, organizationId);
    if (!answer.options || !question.questionsCategoryId) return;
    const module = organization.modules.find(({ _id }) => _id === answer.scope?.moduleId);

    const questionsCategory = await QuestionsCategories.customFindById(question.questionsCategoryId, organizationId);
    const notifications = (questionsCategory.options || []).filter(({ type, setting }) => type === 'notification' && answer.options![setting]);

    await Promise.all(
      notifications.map(async (notification) => {
        const emailAddress = await Settings.customFindOneByName(notification.setting, organization._id);
        if (emailAddress) {
          await Notifications.customCreate(
            {
              emailType: notification.setting,
              emailData: {
                questionsCategoryName: pluralize(questionsCategory.name, 1),
                linkTo: `<a href="${getProtocol()}${organization.domain}/${module?.path}/audits/${answer.scope?._id}?questionId=${question._id
                  }" target="_blank">here</a>`,
              },
              status: 'pending',
              to: emailAddress.value,
              scope: {
                moduleId: module?._id,
              },
            },
            userId,
            organizationId,
          );
        }
      }),
    );
  };
  sendNotifications();

  if (createdAnswer?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdAnswer._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'add',
          element: {
            _id: createdAnswer._doc._id,
            name: createdAnswer._doc.answer,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdAnswer;
};

answersSchema.statics.customSearch = async function (searchQuery, user, organizationId): Promise<IAnswer[]> {
  const { searchText, questionsCategoryId } = searchQuery;
  const pipeline: PipelineStage[] = [
    {
      $match: {
        'metatags.removedAt': { $eq: null },
        organizationId,
      },
    },
  ];

  if (
    !isPermitted({
      user,
      action: 'answers.viewAll',
    })
  ) {
    pipeline.push({
      $match: {
        $or: [{ 'metatags.addedBy': user.userId }],
      },
    });
  }

  join({
    pipeline,
    collection: 'questions',
    from: 'questionId',
    to: 'question',
  });

  // Filter by search text
  pipeline.push({
    $match: {
      'question.questionsCategoryId': questionsCategoryId,
      'question.question': new RegExp(searchText, 'i'),
    },
  });

  pipeline.push({
    $limit: 5,
  });

  pipeline.push({
    $project: {
      _id: 1,
      'metatags.addedBy': 1,
      title: '$question.question',
      type: 'answers',
    },
  });

  let data = await this.aggregate(pipeline);
  const organization = await Organizations.customFindById(organizationId);

  data = await Promise.all(
    data.map(async (answer) => {
      if (!answer.metatags.addedBy) {
        return {
          ...answer,
          user: null,
        };
      }
      try {
        const user = await Users.customFindByIdWithDetails({
          userId: answer?.metatags.addedBy,
          organization,
          awaitForResponse: false,
        });
        return {
          ...answer,
          user: user ? { _id: user._id } : null,
        };
      } catch (error) {
        // User not found - return answer without user field
        // This can happen if user was deleted or userId is invalid
        console.error('Error fetching user details for answer:', answer?.metatags.addedBy, error);
        return {
          ...answer,
          user: null,
        };
      }
    }),
  );

  return data;
};

answersSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAnswer[]> {
  const answers = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answers;
};

answersSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IAnswer | null> {
  const answer = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return answer;
};

answersSchema.statics.customFindById = async function (_id: string): Promise<IAnswer> {
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
  const updatedResult = await this.updateOne(selector, updatedAnswer);

  // Set notifications if configured
  const sendNotifications = async () => {
    const organization = await Organizations.customFindById(organizationId);
    const question = await Questions.customFindById(answer.questionId, organizationId);
    if (!answer.options || !question.questionsCategoryId) return;
    const module = organization.modules.find(({ _id }) => _id === answer.scope?.moduleId);

    const questionsCategory = await QuestionsCategories.customFindById(question.questionsCategoryId, organizationId);
    const notifications = (questionsCategory.options || []).filter(
      ({ type, setting }) => type === 'notification' && !answer.options![setting] && updatedAnswer.options![setting],
    );

    await Promise.all(
      notifications.map(async (notification) => {
        const emailAddress = await Settings.customFindOneByName(notification.setting, organization._id);
        if (emailAddress) {
          await Notifications.customCreate(
            {
              emailType: notification.setting,
              emailData: {
                questionsCategoryName: pluralize(questionsCategory.name, 1),
                linkTo: `<a href="${getProtocol()}${organization.domain}/${module?.path}/audits/${answer.scope?._id}?questionId=${question._id
                  }" target="_blank">here</a>`,
              },
              status: 'pending',
              to: emailAddress.value,
              scope: {
                moduleId: module?._id,
              },
            },
            userId,
            organizationId,
          );
        }
      }),
    );
  };
  sendNotifications();

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(answer);
      const newValues = removeDatabaseFields(updatedAnswer);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'update',
          element: {
            _id: updatedAnswer._id,
            name: updatedAnswer.answer as string,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return updatedAnswer;
};

answersSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
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

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const oldValues = removeDatabaseFields(answer);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'answers',
          action: 'delete',
          element: {
            _id: answer._id,
            name: answer.answer as string,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return deletedResult?.modifiedCount;
};

answersSchema.statics.customDeleteMany = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const answers = await this.customFind(selector, organizationId);
  if (answers.length === 0) return 0;

  return (
    await Promise.all(
      answers?.map((answer) =>
        Promise.all([
          actionsModel.customDeleteMany({ 'scope._id': answer._id }, userId, organizationId),
          this.customDelete({ _id: answer._id }, userId, organizationId),
        ]),
      ),
    )
  )?.reduce((acc, curr) => acc + curr[0], 0);
};

const answersModel = model<IAnswer, IAnswerModel>('Answer', answersSchema, 'answers');

export default answersModel;
