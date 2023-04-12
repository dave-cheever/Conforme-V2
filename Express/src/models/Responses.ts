import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { difference, uniq } from 'lodash';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAuditValues, IOrganization, IResponse, IResponseModel, ISearchResult } from 'app-interfaces';
import { AuditLogs, BusinessUnits, Notifications, Organizations, TrackerItems, Users } from 'app-models';
import {
  genMetatags,
  getAuditValueForAttachments,
  getAuditValueForBoolean,
  getAuditValueForDate,
  getAuditValueForLookup,
  getAuditValueForString,
  getAuditValueForUser,
  getAuditValueForUsersArray,
  getProtocol,
  isPermitted,
  join,
  removeDatabaseFields,
} from 'app-utils';

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
        enum: ['text', 'textMultiline', 'switch', 'datepicker', 'multipleChoice', 'singleChoice', 'url'],
      },
      name: String,
      description: String,
      value: Schema.Types.Mixed,
      required: Boolean,
      outdated: Boolean,
      requiredAnswer: Schema.Types.Mixed,
      notApplicable: Boolean,
      options: [
        {
          label: String,
          value: String,
        },
      ],
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

// This method is used to prepare values object for audit log
const getAuditRecordValues = async ({ oldValues = {}, newValues = {}, organization }): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value: any = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      case 'dueDate':
      case 'lastCompletionDate':
        value = getAuditValueForDate(oldValue, newValue);
        break;

      // If updated 'trackerItemId' field, get tracker item from database and set value as id and label as name
      case 'trackerItemId':
        value = await getAuditValueForLookup({
          collection: TrackerItems,
          labelField: 'name',
          oldValue,
          newValue,
        });
        break;

      // If updated 'businessUnitId' field, get business unit from database and set value as id and label as name
      case 'businessUnitId':
        value = await getAuditValueForLookup({
          collection: BusinessUnits,
          labelField: 'name',
          oldValue,
          newValue,
        });
        break;

      // If updated 'accountableId' or 'responsibleId' fields, get users from database and set value as array of ids and label as joined full names
      case 'accountableId':
      case 'responsibleId':
        value = await getAuditValueForUser({
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'contributorsIds' or 'followersIds' fields, get users from database and set value as array of ids and label as joined full names
      case 'contributorsIds':
      case 'followersIds':
        value = await getAuditValueForUsersArray({
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'evidence' field, set value as evidence name and file name and label as file details
      case 'evidence': {
        const getUploadedPathsArray = (arr) => arr.map(({ uploaded }) => uploaded?.id);
        const removedEvidence = difference(getUploadedPathsArray(oldValue || []), getUploadedPathsArray(newValue || [])).filter(Boolean);
        if (removedEvidence.length > 0) {
          const document = oldValue.find(({ uploaded }) => uploaded?.id === removedEvidence[0]);
          value.old = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        const addedEvidence = difference(getUploadedPathsArray(newValue || []), getUploadedPathsArray(oldValue || [])).filter(Boolean);
        if (addedEvidence.length > 0) {
          const document = newValue.find(({ uploaded }) => uploaded?.id === addedEvidence[0]);
          value.new = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        break;
      }

      // If updated 'attachments' field, set value as attachments name and file name and label as file details
      case 'attachments': {
        value = getAuditValueForAttachments({ oldValue, newValue });
        break;
      }

      // If updated 'actionPlanSubmitted' field, set value as boolean and label as Yes/No
      case 'published':
        value = getAuditValueForBoolean(oldValue, newValue);
        break;

      // If updated 'questions' field, set value as question value and label as question name
      case 'questions': {
        const getAnswersArray = (arr) =>
          arr.map(({ value }, index) => {
            if (Array.isArray(value)) return `${index}-${JSON.stringify(value)}`;

            return `${index}-${value}`;
          });
        const updatedQuestion = difference(getAnswersArray(oldValue || []), getAnswersArray(newValue || [])) as string[];
        if (updatedQuestion.length === 1) {
          const [questionIndex] = updatedQuestion[0].split('-');
          const questionOld = (oldValue || [])[questionIndex];
          const questionNew = (newValue || [])[questionIndex];
          let value: any = {};

          switch (questionOld.type) {
            case 'textConfirm':
            case 'textMultilineConfirm':
              value = getAuditValueForString(questionOld.value, questionNew.value);
              break;
            case 'switch':
              value = getAuditValueForBoolean(questionOld.value, questionNew.value);
              break;
            case 'datepicker': {
              value = getAuditValueForDate(questionOld.value, questionNew.value);
              break;
            }
            case 'multipleChoice': {
              const oldChoices = questionOld.value.map((option, index) => `${index}-${option.isCorrect}`);
              const newChoices = questionNew.value.map((option, index) => `${index}-${option.isCorrect}`);
              const [updatedChoice]: string[] = difference(oldChoices, newChoices);
              const [choiceIndex, choiceValue] = updatedChoice?.split('-');

              // choiceValue keeps the previous value of the choice
              if (choiceValue === 'true') {
                value.old = {
                  label: questionOld.value[choiceIndex].label,
                  value: questionOld.value,
                };
              } else {
                value.new = {
                  label: questionNew.value[choiceIndex].label,
                  value: questionNew.value,
                };
              }
              break;
            }
            default:
              break;
          }
          return {
            ...acc,
            [questionOld.name]: value,
          };
        }
        break;
      }

      default:
        if (typeof oldValue === 'string' && typeof newValue === 'string') value = getAuditValueForString(oldValue, newValue);
    }
    if (!value || Object.keys(value).length === 0) return acc;

    return {
      ...acc,
      [field]: value,
    };
  }, Promise.resolve({}));

  const auditRecordValues = await auditRecordValuesPromise;
  return auditRecordValues;
};

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

responseSchema.statics.customCreate = async function (response: IResponse, userId: string, organizationId: string): Promise<IResponse> {
  // Add users assigned to the response to database if doesn't exist
  const usersIds = [response.responsibleId, response.accountableId, ...(response.contributorsIds || []), ...(response.followersIds || [])];
  await Promise.all(uniq(usersIds).map(async (userId) => Users.customAssertUser({ userId, organizationId })));

  const createdResponse = await this.create({
    ...response,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdResponse?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdResponse._doc);
      const organization = await Organizations.customFindById(organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'responses',
          action: 'add',
          element: {
            _id: createdResponse._id,
            name: values.trackerItemId.new?.label || response._id,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdResponse;
};

responseSchema.statics.customSearch = async function (searchQuery, user, organizationId): Promise<ISearchResult[]> {
  const { searchText } = searchQuery;

  const pipeline: any[] = [
    { // Search must be the first step to make use of index and improve performance
      $match: {
        name: new RegExp(searchText, 'i'),
        organizationId,
      },
    }, {
      $lookup: {
        from: "trackerResponses",
        localField: "_id",
        foreignField: "trackerItemId",
        as: "trackerResponse",
      },
    }, {
      $unwind: {
        path: "$trackerResponse",
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  if (!isPermitted({ user, action: 'responses.viewAll' })) {
    pipeline.push({
      $match: {
        $or: [
          { 'trackerResponse.accountableId': user._id },
          { 'trackerResponse.responsibleId': user._id },
          { 'trackerResponse.contributorsIds': { $in: [user._id] } },
          { 'trackerResponse.followersIds': { $in: [user._id] } },
        ],
      },
    });
  }

  if (!(searchQuery?.includeNotPublished && isPermitted({ user, action: 'responses.viewAll' }))) {
    pipeline.push({
      $match: {
        'trackerResponse.published': true,
      },
    });
  }

  join({
    pipeline,
    collection: 'users',
    from: 'trackerResponse.accountableId',
    to: 'user',
  });

  pipeline.push({
    $limit: 5,
  });

  pipeline.push({
    $project: {
      _id: '$trackerResponse._id',
      title: '$name',
      user: '$user',
      type: 'tracker-item-response',
    },
  });

  const data = await TrackerItems.aggregate(pipeline);
  return data;
};

responseSchema.statics.customFind = async function (selector: any = {}): Promise<IResponse[]> {
  const responses = await this.find({
    ...selector,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return responses;
};

responseSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IResponse | null> {
  const response = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return response;
};

responseSchema.statics.customFindById = async function (_id: string): Promise<IResponse> {
  const response = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!response) throw new Error('Response not found');

  return response;
};

responseSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IResponse>,
  userId: string,
  organizationId: string,
  sendNotification = true,
): Promise<IResponse> {
  const response = await this.customFindOne(selector, organizationId);
  if (!response) throw new GraphQLError("Response doesn't exist");

  const updatedResponse = {
    ...response,
    ...updates,
    metatags: {
      ...response?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedResponse);

  // Add users assigned to the response to database if doesn't exist
  const usersIds = [...(updates.contributorsIds || []), ...(updates.followersIds || [])];
  if (updates.responsibleId) usersIds.push(updates.responsibleId);
  if (updates.accountableId) usersIds.push(updates.accountableId);
  await Promise.all(uniq(usersIds).map(async userId => Users.customAssertUser({ userId, organizationId })));
  const organization = await Organizations.customFindById(organizationId);
  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const trackerItem = await TrackerItems.customFindById(response.trackerItemId, organizationId);

      const oldValues = removeDatabaseFields(response);
      const newValues = removeDatabaseFields(updatedResponse);
      const values = await getAuditRecordValues({
        oldValues,
        newValues,
        organization,
      });

      AuditLogs.customAudit(
        {
          coll: 'responses',
          action: 'update',
          element: {
            _id: response._id,
            name: trackerItem.name,
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  if (response.status === 'draft' && updatedResponse.status === 'submitted' && sendNotification)
    this.submitReviewNotification(updatedResponse, organization);

  return updatedResponse;
};

responseSchema.statics.submitReviewNotification = async function (response: IResponse, organization: IOrganization) {
  let participants: string[] = [];

  const trackerItem = await TrackerItems.customFindById(response.trackerItemId, organization._id);
  if (!trackerItem) return;

  if (response) {
    // handle the empty responsible and accountable cases
    if (response.accountableId !== '') participants.push(response.accountableId);

    if (response.responsibleId !== '') participants.push(response.responsibleId);

    participants = participants.concat(response.followersIds || []);
    participants = participants.concat(response.contributorsIds || []);
  }

  const module = organization.modules.find(({ type }) => type === 'tracker');
  if (module) {
    const assignor = await Users.customFindByIdWithDetails({
      userId: response.metatags.updatedBy ?? response.metatags.addedBy,
      organization,
    });
    await Promise.all(
      uniq(participants).map(async (userId) => {
        const assignee = await Users.customFindByIdWithDetails({ userId, organization });
        await Notifications.customCreate(
          {
            emailType: 'trackerReviewSubmitted',
            emailData: {
              trackerItemName: trackerItem.name,
              trackerItemPath: `<a href="${getProtocol()}${organization.domain}/${module.path}/tracker-item/${response._id}">here</a>`,
            },
            status: 'pending',
            to: [assignee?.email],
            scope: {
              moduleId: module?._id,
            },
          },
          assignor._id,
          organization._id,
        );
      }),
    );
  }
};

responseSchema.statics.customAssigneeNotification = async function (
  responseId: string,
  participantsIds: string[],
  assignedRole: string,
  organization: IOrganization,
): Promise<void> {
  const response = await this.findById(responseId).lean();
  if (!response) return;

  const trackerItem = await TrackerItems.customFindById(response.trackerItemId, organization._id);
  if (!trackerItem) return;

  // TODO: For now take the first tracker module.
  // Need to add module scope to tracker objects in order to fix it.
  const module = organization.modules.find(({ type }) => type === 'tracker');
  if (module) {
    const assignor = await Users.customFindByIdWithDetails({
      userId: response.metatags.updatedBy ?? response.metatags.addedBy,
      organization,
    });
    await Promise.all(
      participantsIds.map(async (userId) => {
        const assignee = await Users.customFindByIdWithDetails({ userId, organization });
        await Notifications.customCreate(
          {
            emailType: 'trackerResponseAssigned',
            emailData: {
              itemName: trackerItem.name,
              linkTo: `<a href="${getProtocol()}${organization.domain}/${module.path}/tracker-item/${responseId}">here</a>`,
              assignedRole,
              assignedBy: assignor.displayName,
            },
            status: 'pending',
            to: [assignee?.email],
            scope: {
              moduleId: module._id,
            },
          },
          assignor._id,
          organization._id,
        );
      }),
    );
  }
};

const responseModel = model<IResponse, IResponseModel>('TrackerResponse', responseSchema, 'trackerResponses');
export default responseModel;
