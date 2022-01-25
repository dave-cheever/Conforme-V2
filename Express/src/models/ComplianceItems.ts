import { v4 as uuidv4 } from "uuid";
import { model, Schema } from 'mongoose';
import { isEqual } from 'date-fns';

import { IAuditValues, IComplianceItem, IComplianceItemModel, IOrganization, IResponse } from 'app-interfaces';
import { AuditLogs, BusinessUnits, Categories, Organizations, RegulatoryBodies, Responses } from 'app-models';
import {
  genMetatags,
  getAuditValueForBoolean,
  getAuditValueForDate,
  getAuditValueForLookup,
  getAuditValueForLookupsArray,
  getAuditValueForString,
  getAuditValueForStringsArray,
  getBasicElement,
  removeDatabaseFields,
} from 'app-utils';
import { diff } from "deep-object-diff";
import { GraphQLError } from "graphql";
import { IChoice } from "src/interfaces/IQuestion";

const complianceItemSchema = new Schema<IComplianceItem, IComplianceItemModel>({
  _id: String,
  name: String,
  description: String,
  categoryId: String,
  regulatoryBodyId: String,
  dueDate: Date,
  frequency: String,
  businessUnitsIds: [String],
  evidenceItems: [String],
  organizationId: String,
  questions: [{
    _id: false,
    type: {
      type: String,
      enum: ['textConfirm', 'textMultilineConfirm', 'switch', 'datepicker', 'multipleChoice'],
    },
    name: String,
    description: String,
    value: Schema.Types.Mixed,
    required: Boolean,
    outdated: Boolean,
  }],
  locationsIds: [String],
  published: Boolean,
  reference: String,
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

    switch (field) {
      case 'dueDate':
        value = getAuditValueForDate(oldValues[field], newValues[field]);
        break;

      // If updated 'categoryId' field, get category from database and set value as id and label as name
      case 'categoryId':
        value = await getAuditValueForLookup({
          collection: Categories,
          labelField: 'name',
          oldValue: oldValues[field],
          newValue: newValues[field],
          organization,
        });
        break;

      // If updated 'regulatoryBodyId' field, get regulatory body from database and set value as id and label as name
      case 'regulatoryBodyId':
        value = await getAuditValueForLookup({
          collection: RegulatoryBodies,
          labelField: 'name',
          oldValue: oldValues[field],
          newValue: newValues[field],
          organization,
        });
        break;

      // If updated 'businessUnitsIds' field, get business units from database and set value as array of ids and label as joined names
      case 'businessUnitsIds':
        value = await getAuditValueForLookupsArray({
          collection: BusinessUnits,
          labelField: 'name',
          oldValue: oldValues[field],
          newValue: newValues[field],
          organization,
        });
        break;

      // If updated 'evidenceItems' field, set value as array of names and label as joined names
      case 'evidenceItems':
        value = getAuditValueForStringsArray(oldValues[field], newValues[field]);
        break;

      // If updated 'published' field, set value as boolean and label as Yes/No
      case 'published':
        value = getAuditValueForBoolean(oldValues[field], newValues[field]);
        break;

      case 'questions':
        // TODO: add audit log for questions
        return acc;

      default:
        value = getAuditValueForString(oldValues[field], newValues[field]);
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

complianceItemSchema.statics.customCreate = async function (complianceItem: IComplianceItem, userId: string, organizationId: string): Promise<IComplianceItem> {
  const createdComplianceItem = await this.create({
    ...complianceItem,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId),
  });

  if (createdComplianceItem?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdComplianceItem._doc);
      const newValues = removeDatabaseFields(createdComplianceItem._doc);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit({
        coll: 'complianceItems',
        action: "add",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return createdComplianceItem;
};

complianceItemSchema.statics.customFind = async function (selector: any = {}): Promise<IComplianceItem[]> {
  const complianceItems = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return complianceItems;
};

complianceItemSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IComplianceItem | null> {
  const complianceItem = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return complianceItem;
};

complianceItemSchema.statics.customFindById = async function (_id: string): Promise<IComplianceItem> {
  const complianceItem = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!complianceItem) {
    throw new Error("Compliance item not found");
  }
  return complianceItem;
};

complianceItemSchema.statics.customUpdateOne = async function (selector: object = {}, updates: Partial<IComplianceItem>, userId: string, organizationId: string): Promise<IComplianceItem> {
  const complianceItem = await this.customFindOne(selector, organizationId);
  if (!complianceItem) {
    throw new GraphQLError('Compliance item doesn\'t exist');
  }

  const updatedComplianceItem = {
    ...complianceItem,
    ...updates,
    metatags: {
      ...complianceItem?.metatags,
      ...genMetatags("updated", userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedComplianceItem);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedComplianceItem);
      const oldValues = removeDatabaseFields(complianceItem);
      const newValues = removeDatabaseFields(updatedComplianceItem);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ oldValues, newValues, organization });
      AuditLogs.customAudit({
        coll: 'complianceItems',
        action: "update",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return updatedComplianceItem;
};

complianceItemSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const complianceItem = await this.customFindOne(selector, organizationId);
  if (!complianceItem) {
    throw new GraphQLError('Category doesn\'t exist');
  }

  const deletedResult = await this.deleteMany({
    ...selector,
    organizationId,
  });

  if (deletedResult?.deletedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(complianceItem);
      const oldValues = removeDatabaseFields(complianceItem);
      const organization = await Organizations.customFindById(organizationId, organizationId);
      const values = await getAuditRecordValues({ oldValues, organization });
      AuditLogs.customAudit({
        coll: 'complianceItems',
        action: "delete",
        element,
        values,
      }, userId, organizationId);
    };
    addAuditLog();
  }

  return deletedResult?.deletedCount;
};

complianceItemSchema.statics.customGenerateReference = async function (): Promise<string> {
  let reference = "0000001";
  const lastComplianceItem = await this.findOne({}).sort({ 'metatags.addedAt': -1 }).lean();
  if (lastComplianceItem) {
    const newReference = parseInt(lastComplianceItem.reference) + 1;
    reference = ('000000' + newReference).slice(-7);
  }
  return reference;
};

complianceItemSchema.statics.customSynchronizeResponses = async function ({
  complianceItem,
  userId,
  organizationId,
  prevDueDate,
}: {
  complianceItem: IComplianceItem,
  userId: string,
  organizationId: string
  prevDueDate?: Date,
}) {
  const responses = await Responses.customFind({ complianceItemId: complianceItem._id }, organizationId);
  const unprocessedBusinessUnitsIds = [...complianceItem.businessUnitsIds];

  for (const response of responses) {
    const index = unprocessedBusinessUnitsIds.findIndex(_id => _id === response.businessUnitId);
    let isPublished = complianceItem.published;

    if (index === -1) {
      // If BU of Response is not selected in CI
      // Do not publish it
      isPublished = false;
    } else {
      // If BU of Response is selected in CI
      // Set its publish state to same as CI - published or not published
      // And remove from not processed array
      unprocessedBusinessUnitsIds.splice(index, 1);
    }
    const updatedResponse: Pick<IResponse, 'published' | 'evidence' | 'questions' | 'status' | 'nextRenewalDate'> = {
      published: isPublished,
      evidence: [...response.evidence.filter(({ outdated }) => outdated)], // add all past evidence
      questions: [...response.questions.filter(({ outdated }) => outdated)], // add all past questions
      status: response.status,
      nextRenewalDate: response.nextRenewalDate,
    };

    // Get not outdated evidence from response
    const currentEvidence = response.evidence.filter(({ outdated }) => !outdated);

    // Check if evidence was removed from CI
    for (const evidence of currentEvidence) {
      if (!complianceItem.evidenceItems.includes(evidence.name)) {
        // If current evidence not exist in CI evidence items
        // Set it to outdated
        updatedResponse.evidence.push({
          ...evidence,
          outdated: true,
        });
      }
    }

    // Check if evidence was added to CI or re-ordered
    for (const evidenceName of complianceItem.evidenceItems) {
      const existingEvidence = currentEvidence.find(({ name }) => name === evidenceName);
      if (existingEvidence) {
        // If CI evidence exist in response, leave it
        updatedResponse.evidence.push(existingEvidence);
      } else {
        // If CI evidence not exist in response, add it
        updatedResponse.evidence.push({ name: evidenceName });
      }
    }

    // Get not outdated questions from response
    const currentQuestions = response.questions.filter(({ outdated }) => !outdated);

    // Check if question was removed from CI
    for (const question of currentQuestions) {
      const existingQuestion = (complianceItem.questions || []).find(({ name, type }) => name === question.name && type === question.type);
      if (!existingQuestion) {
        // If current question not exist in CI questions
        // Set it to outdated
        updatedResponse.questions.push({
          ...question,
          outdated: true,
        });
      }
    }

    // Check if question was added to CI or re-ordered
    for (const question of complianceItem.questions || []) {
      const existingQuestion = currentQuestions.find(({ name, type }) => name === question.name && type === question.type);
      if (existingQuestion) {
        // If CI question exist in response, leave it but update with possible changes
        updatedResponse.questions.push({
          ...existingQuestion,
          value: question.value,
          description: question.description,
          required: question.required,
        });
      } else {
        // If CI question not exist in response, add it
        updatedResponse.questions.push(question);
      }
    }

    // If questions or evidence has changed, set right status
    const areRequiredQuestionsAnswered = updatedResponse.questions
      .filter(({ required, outdated }) => !outdated && required)
      .every(({ value, type }) => {
        if (type === "multipleChoice") {
          return (value as IChoice[]).some(choice => choice["isCorrect"] === true);
        }
        return value || (typeof value === 'boolean' && value === false);
      });
    const isEvidenceUploaded = updatedResponse.evidence
      .filter(({ outdated }) => !outdated)
      .every(({ uploaded }) => uploaded && uploaded.id);
    if (areRequiredQuestionsAnswered && isEvidenceUploaded) {
      updatedResponse.status = 'completed';
    } else if (response.status !== 'notStarted') {
      updatedResponse.status = 'inProgress';
    }

    // If DueDate was updated in CI, check if should be updated in response
    if (
      (!response.nextRenewalDate && !prevDueDate) ||
      (response.nextRenewalDate && prevDueDate && isEqual(response.nextRenewalDate, prevDueDate))
    ) {
      // If previous CI date was same as Response date
      updatedResponse.nextRenewalDate = complianceItem.dueDate!;
    }

    await Responses.customUpdateOne({ _id: response._id }, updatedResponse, userId, organizationId);
  }

  // Create selected that doesn't exist
  for (const businessUnitId of unprocessedBusinessUnitsIds) {
    const businessUnit = await BusinessUnits.customFindById(businessUnitId, organizationId);

    await Responses.customCreate({
      _id: uuidv4(),
      complianceItemId: complianceItem._id,
      businessUnitId: businessUnitId,
      accountableId: businessUnit.ownerId,
      responsibleId: businessUnit.ownerId,
      contributorsIds: [],
      followersIds: [],
      status: 'notStarted',
      attachments: [],
      lastCompletedDate: null,
      lastRenewalDate: null,
      nextRenewalDate: complianceItem.dueDate,
      evidence: complianceItem.evidenceItems.map(name => ({ name })),
      questions: complianceItem.questions,
      organizationId,
      published: complianceItem.published,
      // @ts-ignore
      metatags: genMetatags('added', userId),
    }, userId, organizationId);
  }
};

const complianceItemModel = model<IComplianceItem, IComplianceItemModel>('ComplianceItem', complianceItemSchema, 'complianceItems');
export default complianceItemModel;
