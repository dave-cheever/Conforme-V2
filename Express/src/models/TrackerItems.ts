import { isEqual } from 'date-fns';
import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import {
  IAuditValues,
  IResponse,
  ITrackerItem,
  ITrackerItemModel,
} from 'app-interfaces';
import {
  AuditLogs,
  BusinessUnits,
  Categories,
  Organizations,
  RegulatoryBodies,
  Responses,
} from 'app-models';
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

const trackerItemSchema = new Schema<ITrackerItem, ITrackerItemModel>({
  _id: String,
  name: String,
  description: String,
  categoryId: String,
  regulatoryBodyId: String,
  dueDate: Date,
  dueDateCalculation: {
    type: String,
    enum: [
      'fromDueDate',
      'fromCompletionDate',
    ],
  },
  dueDateEditable: Boolean,
  frequency: String,
  businessUnitsIds: [String],
  evidenceItems: [String],
  allowAttachments: Boolean,
  organizationId: String,
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
      requiredAnswer: Schema.Types.Mixed,
      outdated: Boolean,
      notApplicable: Boolean,
      options: [{
        _id: false,
        label: String,
        value: String,
      }],
    },
  ],
  locationsIds: [String],
  published: Boolean,
  reference: String,
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
const getAuditRecordValues = async ({
  oldValues = {},
  newValues = {},
}): Promise<IAuditValues> => {
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
        });
        break;

      // If updated 'regulatoryBodyId' field, get regulatory body from database and set value as id and label as name
      case 'regulatoryBodyId':
        value = await getAuditValueForLookup({
          collection: RegulatoryBodies,
          labelField: 'name',
          oldValue: oldValues[field],
          newValue: newValues[field],
        });
        break;

      // If updated 'businessUnitsIds' field, get business units from database and set value as array of ids and label as joined names
      case 'businessUnitsIds':
        value = await getAuditValueForLookupsArray({
          collection: BusinessUnits,
          labelField: 'name',
          oldValue: oldValues[field],
          newValue: newValues[field],
        });
        break;

      // If updated 'evidenceItems' field, set value as array of names and label as joined names
      case 'evidenceItems':
        value = getAuditValueForStringsArray(
          oldValues[field],
          newValues[field],
        );
        break;

      // If updated boolean field, set value as boolean and label as Yes/No
      case 'allowAttachments':
      case 'dueDateEditable':
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

trackerItemSchema.statics.customCreate = async function (
  trackerItem: ITrackerItem,
  userId: string,
  organizationId: string,
): Promise<ITrackerItem> {
  const createdTrackerItem = await this.create({
    ...trackerItem,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdTrackerItem?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdTrackerItem._doc);
      const newValues = removeDatabaseFields(createdTrackerItem._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'trackerItems',
          action: 'add',
          element,
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdTrackerItem;
};

trackerItemSchema.statics.customFind = async function (
  selector: any = {},
): Promise<ITrackerItem[]> {
  const trackerItems = await this.find({
    ...selector,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return trackerItems;
};

trackerItemSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<ITrackerItem | null> {
  const trackerItem = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return trackerItem;
};

trackerItemSchema.statics.customFindById = async function (
  _id: string,
): Promise<ITrackerItem> {
  const trackerItem = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!trackerItem) throw new Error('Tracker item not found');

  return trackerItem;
};

trackerItemSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<ITrackerItem>,
  userId: string,
  organizationId: string,
): Promise<ITrackerItem> {
  const trackerItem = await this.customFindOne(selector, organizationId);
  if (!trackerItem) throw new GraphQLError("Tracker item doesn't exist");

  const updatedTrackerItem = {
    ...trackerItem,
    ...updates,
    metatags: {
      ...trackerItem?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedTrackerItem);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedTrackerItem);
      const oldValues = removeDatabaseFields(trackerItem);
      const newValues = removeDatabaseFields(updatedTrackerItem);
      const values = await getAuditRecordValues({
        oldValues,
        newValues,
      });
      AuditLogs.customAudit(
        {
          coll: 'trackerItems',
          action: 'update',
          element,
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return updatedTrackerItem;
};

trackerItemSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const trackerItem = await this.customFindOne(selector, organizationId);
  if (!trackerItem) throw new GraphQLError("Category doesn't exist");

  const updatedTrackerItem = {
    ...trackerItem,
    metatags: {
      ...trackerItem?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedTrackerItem);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(trackerItem);
      const oldValues = removeDatabaseFields(trackerItem);
      const values = await getAuditRecordValues({ oldValues });
      AuditLogs.customAudit(
        {
          coll: 'trackerItems',
          action: 'delete',
          element,
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

trackerItemSchema.statics.customGenerateReference =
  async function (): Promise<string> {
    let reference = '0000001';
    const lastTrackerItem = await this.findOne({})
      .sort({ 'metatags.addedAt': -1 })
      .lean();
    if (lastTrackerItem) {
      const newReference = parseInt(lastTrackerItem.reference, 10) + 1;
      reference = `000000${newReference}`.slice(-7);
    }
    return reference;
  };

trackerItemSchema.statics.customSynchronizeResponses = async function ({
  trackerItem,
  userId,
  prevDueDate,
  sendNotification = true,
  organizationId,
}: {
  trackerItem: ITrackerItem;
  userId: string;
  organizationId: string;
  sendNotification?: boolean;
  prevDueDate?: Date;
}) {
  const organization = await Organizations.customFindById(organizationId);
  const responses = await Responses.customFind(
    { trackerItemId: trackerItem._id },
    organizationId,
  );
  const unprocessedBusinessUnitsIds = [...trackerItem.businessUnitsIds];

  for (const response of responses) {
    const index = unprocessedBusinessUnitsIds.findIndex(
      (_id) => _id === response.businessUnitId,
    );
    let isPublished = trackerItem.published;

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
    const updatedResponse: Pick<
      IResponse,
      'published' | 'evidence' | 'questions' | 'status' | 'dueDate'
    > = {
      published: isPublished,
      evidence: [],
      questions: [],
      status: 'draft',
      dueDate: response.dueDate,
    };

    // Update evidence
    // - remove deleted
    // - keep uploaded
    // - add new
    for (const evidenceItem of trackerItem.evidenceItems || []) {
      const existingEvidence = response.evidence.find(({ name }) => name === evidenceItem);
      if (existingEvidence) updatedResponse.evidence.push(existingEvidence);
      else updatedResponse.evidence.push({ name: evidenceItem });
    }

    for (const question of trackerItem.questions || []) {
      const existingQuestion = response.questions.find(
        ({ name, type }) => name === question.name && type === question.type,
      );
      if (existingQuestion) {
        // If CI question exist in response, leave it but update with possible changes
        updatedResponse.questions.push({
          ...existingQuestion,
          value: existingQuestion.value,
          description: question.description,
          required: question.required,
          requiredAnswer: question.requiredAnswer,
          notApplicable: question.notApplicable,
        });
      } else {
        // If CI question not exist in response, add it
        updatedResponse.questions.push({
          ...question,
          value: question.value || null,
        });
      }
    }

    if (
      (!prevDueDate && trackerItem.dueDate) || // there was no due date, and was set
      (prevDueDate && !trackerItem.dueDate) || // there was due date, and was unset
      (prevDueDate && trackerItem.dueDate && !isEqual(new Date(prevDueDate), new Date(trackerItem.dueDate))) // There was due date but has changed
    ) {
      // If previous CI date was same as Response date
      updatedResponse.dueDate = trackerItem.dueDate || null;
    }

    await Responses.customUpdateOne(
      { _id: response._id },
      updatedResponse,
      userId,
      organizationId,
    );
  }

  // Create selected that doesn't exist
  for (const businessUnitId of unprocessedBusinessUnitsIds) {
    const businessUnit = await BusinessUnits.customFindById(
      businessUnitId,
      organizationId,
    );

    const assignee = businessUnit.ownerId || userId;
    const response = await Responses.customCreate(
      {
        _id: uuidv4(),
        trackerItemId: trackerItem._id,
        businessUnitId,
        accountableId: assignee,
        responsibleId: assignee,
        contributorsIds: [],
        followersIds: [],
        status: 'draft',
        attachments: [],
        lastCompletedDate: null,
        dueDate: trackerItem.dueDate,
        evidence: trackerItem.evidenceItems.map((name) => ({ name })),
        questions: trackerItem.questions,
        organizationId,
        published: trackerItem.published,
        // @ts-ignore
        metatags: genMetatags('added', userId),
      },
      userId,
      organizationId,
    );

    // Send notification to assignee
    if (sendNotification) await Responses.customAssigneeNotification(response._id, [assignee], 'accountable', organization);
  }
};

const trackerItemModel = model<ITrackerItem, ITrackerItemModel>(
  'TrackerItem',
  trackerItemSchema,
  'trackerItems',
);
export default trackerItemModel;
