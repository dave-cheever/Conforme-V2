import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAuditType, IAuditTypeModel, IAuditValue, IAuditValues } from 'app-interfaces';
import { AuditLogs, QuestionsCategories } from 'app-models';
import { genMetatags, getAuditValueForDate, getAuditValueForLookupsArray, getAuditValueForString, getBasicElement, removeDatabaseFields } from 'app-utils';

const auditTypesSchema = new Schema<IAuditType, IAuditTypeModel>({
  _id: String,
  name: String,
  frequency: {
    type: String,
    enum: [
      'Daily',
      'Weekly',
      'Monthly',
      'Quarterly',
      '6 months',
      'Annual',
      '2 years',
      '3 years',
      '5 years',
      'Ad-hoc',
    ],
  },
  startingDate: Date,
  sections: [
    {
      type: {
        type: String,
        enum: ['questionsCategory'],
      },
      _id: String,
    },
  ],
  view: {
    type: String,
    enum: ['categorized', 'singlePage'],
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
    let value: IAuditValue = {};
    const oldValue = oldValues[field];
    const newValue = newValues[field];

    switch (field) {
      case 'startingDate':
        value = getAuditValueForDate(oldValue, newValue);
        break;

      // If updated 'sections' field, set value as section item ID and label as section item name
      case 'sections': {
        const getSectionsIdsArray = (arr) => arr.map(({ _id }) => _id);
        const oldIds = getSectionsIdsArray(oldValue || []);
        const newIds = getSectionsIdsArray(newValue || []);

        value = await getAuditValueForLookupsArray({
          collection: QuestionsCategories,
          labelField: 'name',
          oldValue: oldIds,
          newValue: newIds,
        });
        break;
      }

      default:
        if (typeof oldValue === 'string' || typeof newValue === 'string')
          value = getAuditValueForString(oldValue, newValue);
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

auditTypesSchema.statics.customCreate = async function (
  auditType: IAuditType,
  userId: string,
  organizationId: string,
): Promise<IAuditType> {
  const createdAuditType = await this.create({
    ...auditType,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdAuditType?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdAuditType._doc);
      const newValues = removeDatabaseFields(createdAuditType._doc);
      const values = await getAuditRecordValues({ newValues });
      AuditLogs.customAudit(
        {
          coll: 'auditTypes',
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

  return createdAuditType;
};

auditTypesSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAuditType[]> {
  const auditTypes = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return auditTypes;
};

auditTypesSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IAuditType | null> {
  const auditType = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return auditType;
};

auditTypesSchema.statics.customFindById = async function (
  _id: string,
): Promise<IAuditType> {
  const auditType = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!auditType) throw new Error('Audit type not found');

  return auditType;
};

auditTypesSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAuditType>,
  userId: string,
  organizationId: string,
): Promise<IAuditType> {
  const auditType = await this.customFindOne(selector, organizationId);
  if (!auditType) throw new GraphQLError("Audit type doesn't exist");

  const updatedAuditType = {
    ...auditType,
    ...updates,
    metatags: {
      ...auditType?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedAuditType);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedAuditType);
      const oldValues = removeDatabaseFields(auditType);
      const newValues = removeDatabaseFields(updatedAuditType);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'auditTypes',
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

  return updatedAuditType;
};

auditTypesSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const auditType = await this.customFindOne(selector, organizationId);
  if (!auditType) throw new GraphQLError("Audit type doesn't exist");

  const updatedAuditType = {
    ...auditType,
    metatags: {
      ...auditType?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAuditType);

  // if (deletedResult?.modifiedCount) {
  //   const addAuditLog = async () => {
  //     const oldValues = removeDatabaseFields(auditType);
  //     const values = await getAuditRecordValues({ oldValues });
  //     AuditLogs.customAudit({
  //       coll: 'questions',
  //       action: "delete",
  //       element: {
  //         _id: auditType._id,
  //         name: auditType.question,
  //       },
  //       values,
  //     }, userId, organizationId);
  //   };
  //   addAuditLog();
  // }

  return deletedResult?.modifiedCount;
};

const auditTypeModel = model<IAuditType, IAuditTypeModel>(
  'AuditType',
  auditTypesSchema,
  'auditTypes',
);
export default auditTypeModel;
