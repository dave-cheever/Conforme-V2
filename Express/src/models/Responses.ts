import { model, Schema } from 'mongoose';
import { diff } from 'deep-object-diff';
import _difference from 'lodash/difference';
import { v4 as uuidv4 } from "uuid";

import { IAuditValues, IResponse, IResponseModel, IQuestionChoice } from 'app-interfaces';
import {
  genMetatags,
  getAuditValueForBoolean,
  getAuditValueForDate,
  getAuditValueForLookup,
  getAuditValueForLookupsArray,
  getAuditValueForString,
  getNextRenewalDate,
  getPrevRenewalDate,
  removeDatabaseFields,
} from 'app-utils';
import { AuditLogs, BusinessUnits, ComplianceItems, Organizations, Users } from 'app-models';
import { GraphQLError } from 'graphql';

const responseSchema = new Schema<IResponse, IResponseModel>({
  _id: String,
  complianceItemId: String,
  businessUnitId: String,
  accountableId: String,
  responsibleId: String,
  contributorsIds: [String],
  followersIds: [String],
  firstCompletionDate: Date,
  lastCompletionDate: Date,
  lastRenewalDate: Date,
  nextRenewalDate: Date,
  organizationId: String,
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
      enum: ['text', 'textMultiline', 'switch', 'datepicker', 'multipleChoice'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
    requiredAnswer: String,
    notApplicable: Boolean
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

// This method is used to prepare values object for audit log
const getAuditRecordValues = async ({ oldValues = {}, newValues = {}, organization }): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      case 'nextRenewalDate':
      case 'lastRenewalDate':
        value = getAuditValueForDate(oldValue, newValue);
        break;

      // If updated 'complianceItemId' field, get compliance item from database and set value as id and label as name
      case 'complianceItemId':
        value = await getAuditValueForLookup({
          collection: ComplianceItems,
          labelField: 'name',
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'businessUnitId' field, get business unit from database and set value as id and label as name
      case 'businessUnitId':
        value = await getAuditValueForLookup({
          collection: BusinessUnits,
          labelField: 'name',
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'accountableId' or 'responsibleId' fields, get users from database and set value as array of ids and label as joined full names
      case 'accountableId':
      case 'responsibleId':
        value = await getAuditValueForLookup({
          collection: Users,
          labelField: ['firstName', 'lastName'],
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'contributorsIds' or 'followersIds' fields, get users from database and set value as array of ids and label as joined full names
      case 'contributorsIds':
      case 'followersIds':
        value = await getAuditValueForLookupsArray({
          collection: Users,
          labelField: ['firstName', 'lastName'],
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'evidence' field, set value as evidence name and file name and label as file details
      case 'evidence':
        const getUploadedPathsArray = arr => arr.map(({ uploaded }) => uploaded?.id);
        const removedEvidence = _difference(getUploadedPathsArray(oldValue || []), getUploadedPathsArray(newValue || [])).filter(Boolean);
        if (removedEvidence.length > 0) {
          const document = oldValue.find(({ uploaded }) => uploaded?.id === removedEvidence[0]);
          value['old'] = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        const addedEvidence = _difference(getUploadedPathsArray(newValue || []), getUploadedPathsArray(oldValue || [])).filter(Boolean);
        if (addedEvidence.length > 0) {
          const document = newValue.find(({ uploaded }) => uploaded?.id === addedEvidence[0]);
          value['new'] = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`
          };
        }
        break;

      // If updated 'attachments' field, set value as evidence name and file name and label as file details
      case 'attachments':
        const getAttachmentsPathsArray = arr => arr.map(({ uploaded }) => uploaded?.path);
        const removedAttachments = _difference(getAttachmentsPathsArray(oldValue || []), getAttachmentsPathsArray(newValue || [])).filter(Boolean);
        if (removedAttachments.length > 0) {
          const document = oldValue.find(({ uploaded }) => uploaded.path === removedAttachments[0]);
          value['old'] = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`,
          };
        }
        const addedAttachments = _difference(getAttachmentsPathsArray(newValue || []), getAttachmentsPathsArray(oldValue || [])).filter(Boolean);
        if (addedAttachments.length > 0) {
          const document = newValue.find(({ uploaded }) => uploaded.path === addedAttachments[0]);
          value['new'] = {
            value: document.uploaded,
            label: `${document.name} - ${document.uploaded.name}`
          };
        }
        break;

      // If updated 'actionPlanSubmitted' field, set value as boolean and label as Yes/No
      case 'published':
        value = getAuditValueForBoolean(oldValue, newValue);
        break;

      // If updated 'questions' field, set value as question value and label as question name
      case 'questions':
        const getAnswersArray = arr => arr.map(({ value }, index) => {
          if (Array.isArray(value)) {
            return `${index}-${JSON.stringify(value)}`;
          }
          return `${index}-${value}`;
        });
        const updatedQuestion = _difference(getAnswersArray(oldValue || []), getAnswersArray(newValue || [])) as string[];
        if (updatedQuestion.length === 1) {
          const [questionIndex] = updatedQuestion[0].split('-');
          const questionOld = (oldValue || [])[questionIndex];
          const questionNew = (newValue || [])[questionIndex];
          let value: object = {};

          switch (questionOld.type) {
            case 'textConfirm':
            case 'textMultilineConfirm':
              value = getAuditValueForString(questionOld.value, questionNew.value);
              break;
            case 'switch':
              value = getAuditValueForBoolean(questionOld.value, questionNew.value);
              break;
            case 'datepicker':
              value = getAuditValueForDate(questionOld.value, questionNew.value);
              break;
            case 'multipleChoice':
              const oldChoices = questionOld.value.map((option, index) => `${index}-${option.isCorrect}`);
              const newChoices = questionNew.value.map((option, index) => `${index}-${option.isCorrect}`);
              const updatedChoice = _difference(oldChoices, newChoices)[0];
              const [choiceIndex, choiceValue] = updatedChoice?.split('-');

              // choiceValue keeps the previous value of the choice
              if (choiceValue === 'true') {
                value['old'] = {
                  label: questionOld.value[choiceIndex].label,
                  value: questionOld.value,
                };
              } else {
                value['new'] = {
                  label: questionNew.value[choiceIndex].label,
                  value: questionNew.value,
                };
              }
              break;
          }
          return {
            ...acc,
            [questionOld.name]: value,
          };
        }
        break;

      default:
        if (typeof oldValue === 'string' && typeof newValue === 'string') {
          value = getAuditValueForString(oldValue, newValue);
        }
    }
    if (!value || Object.keys(value).length === 0) {
      return acc;
    }
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
  const createdResponse = await this.create({
    ...response,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId),
  });

  if (createdResponse?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdResponse._doc);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit({
        coll: 'responses',
        action: "add",
        element: {
          _id: createdResponse._id,
          name: values.complianceItemId.new?.label || response._id,
        },
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return createdResponse;
};

responseSchema.statics.customFind = async function (selector: any = {}): Promise<IResponse[]> {
  const responses = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return responses;
};

responseSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IResponse | null> {
  const response = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return response;
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

responseSchema.statics.customUpdateOne = async function (selector: object = {}, updates: Partial<IResponse>, userId: string, organizationId: string): Promise<IResponse> {
  const response = await this.customFindOne(selector, organizationId);
  if (!response) {
    throw new GraphQLError('Response doesn\'t exist');
  }

  const updatedResponse = {
    ...response,
    ...updates,
    metatags: {
      ...response?.metatags,
      ...genMetatags("updated", userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedResponse);
  await this.customRecalculateResponse(response._id);

  const assertAttendees = async () => {
    const usersIds = [
      ...(updates.contributorsIds || []),
      ...(updates.followersIds || []),
    ];
    if (updates.responsibleId) {
      usersIds.push(updates.responsibleId);
    }
    if (updates.accountableId) {
      usersIds.push(updates.accountableId);
    }
    for (const userId of usersIds) {
      const user = await Users.customFindById(userId, organizationId);
      if (!user) {
        await Users.customAdd({ _id: userId }, userId, organizationId);
      }
    }
  };
  assertAttendees();

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const complianceItem = await ComplianceItems.customFindById(response.complianceItemId, organizationId);
      const oldValues = removeDatabaseFields(response);
      const newValues = removeDatabaseFields(updatedResponse);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ oldValues, newValues, organization });
      AuditLogs.customAudit({
        coll: 'responses',
        action: "update",
        element: {
          _id: response._id,
          name: complianceItem.name,
        },
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return updatedResponse;
};

responseSchema.statics.customRecalculateResponse = async function (responseId: string): Promise<void> {
  const response: IResponse = await responseModel.findById(responseId).lean();
  const complianceItem = await ComplianceItems.customFindById(response.complianceItemId, response.organizationId);

  const areRequiredQuestionsAnswered = response.questions
    .filter(({ required, outdated }) => required && !outdated)
    .every(({ value, type, requiredAnswer }) => {
      if (type === "multipleChoice") {
        return (value as IQuestionChoice[]).some(choice => choice["isCorrect"] === true);
      }
      if (type === "switch" && requiredAnswer) {
        return (value === "yes" && requiredAnswer === "yes") || (value === "no" && requiredAnswer === "no");
      }
      return value || (typeof value === 'boolean' && value === false);
    });
  const isEvidenceUploaded = response.evidence
    .filter(({ outdated }) => !outdated)
    .every(({ uploaded }) => uploaded?.id);
  const isResponseCompleted = areRequiredQuestionsAnswered && isEvidenceUploaded;

  // any change triggers inProgress status from notStarted
  let newStatus;
  if (response.status === 'notStarted') {
    newStatus = 'inProgress';
  }
  if (response.status === 'completed' && !isResponseCompleted) {
    newStatus = 'inProgress';
  }
  if (response.status !== 'completed' && isResponseCompleted) {
    newStatus = 'completed';
  }

  let nextRenewalDate = response.nextRenewalDate;
  if (response.status === 'completed' && newStatus === 'inProgress') {
    nextRenewalDate = getPrevRenewalDate(response.nextRenewalDate || new Date(), complianceItem.frequency);
  } else if ((response.status === 'completed' && newStatus) || newStatus === 'completed') {
    nextRenewalDate = getNextRenewalDate(response.nextRenewalDate || new Date(), complianceItem.frequency);
  }
  response.nextRenewalDate = nextRenewalDate;

  if (newStatus) {
    response.status = newStatus;
    if (newStatus === 'completed') {
      response.lastCompletionDate = new Date();
    }
    if (!response.firstCompletionDate) {
      response.firstCompletionDate = new Date();
    }
  }

  await responseModel.updateOne({ _id: responseId }, response);
}

const responseModel = model<IResponse, IResponseModel>('Response', responseSchema);
export default responseModel;
