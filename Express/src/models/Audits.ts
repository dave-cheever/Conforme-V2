import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { uniq } from 'lodash';
import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAudit, IAuditModel, IAuditValue, IAuditValues } from 'app-interfaces';
import { AuditLogs, AuditTypes, BusinessUnits, Locations, Organizations, Users } from 'app-models';
import {
  genMetatags,
  getAuditValueForDate,
  getAuditValueForLookup,
  getAuditValueForString,
  getAuditValueForUser,
  getAuditValueForUsersArray,
  isPermitted,
  join,
  removeDatabaseFields,
} from 'app-utils';

import answersModel from './Answers';
import questionModel from './Questions';

const auditsSchema = new Schema<IAudit, IAuditModel>({
  _id: String,
  auditTypeId: String,
  reference: String,
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'missed'],
  },
  dueDate: Date,
  completedDate: Date,
  walkType: {
    type: String,
    enum: ['physical', 'virtual'],
  },
  locationId: String,
  businessUnitId: String,
  auditorId: String,
  participantsIds: [String],
  recurring: Boolean,
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
const getAuditRecordValues = async ({ oldValues = {}, newValues = {}, organization }): Promise<IAuditValues> => {
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
      // If updated 'auditTypeId' field, get audit type from database and set value as id and label as name
      case 'auditTypeId':
        value = await getAuditValueForLookup({
          collection: AuditTypes,
          labelField: 'name',
          oldValue,
          newValue,
        });
        break;

      case 'dueDate':
      case 'completedDate':
        value = getAuditValueForDate(oldValue, newValue);
        break;

      // If updated 'participantsIds' field, set user's ID as value and full name as label
      case 'participantsIds':
        value = await getAuditValueForUsersArray({
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'auditorId' field, set user's ID as value and full name as label
      case 'auditorId':
        value = await getAuditValueForUser({
          oldValue,
          newValue,
          organization,
        });
        break;

      // If updated 'locationId' field, get location from database and set value as id and label as name
      case 'locationId':
        value = await getAuditValueForLookup({
          collection: Locations,
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

auditsSchema.statics.customGenerateReference = async function (): Promise<string> {
  let reference = '0000001';
  const lastAudit = await this.findOne({}).sort({ 'metatags.addedAt': -1 }).lean();
  if (lastAudit && lastAudit.reference) {
    const newReference = parseInt(lastAudit.reference, 10) + 1;
    reference = `000000${newReference}`.slice(-7);
  }
  return reference;
};

auditsSchema.statics.customCreate = async function (audit: IAudit, userId: string, organizationId: string): Promise<IAudit> {
  // Add auditor and participants to the database if doesn't exist
  const usersIds = [audit.auditorId, ...(audit.participantsIds || [])];
  await Promise.all(uniq(usersIds).map(async (userId) => Users.customAssertUser({ userId, organizationId })));

  const createdAudit = await this.create({
    ...audit,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdAudit?._doc) {
    const addAuditLog = async () => {
      const newValues = removeDatabaseFields(createdAudit._doc);
      const organization = await Organizations.customFindById(organizationId);
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'audits',
          action: 'add',
          element: {
            _id: createdAudit._doc._id,
            name: values.businessUnitId.new?.label || 'Virtual',
          },
          values,
        },
        userId,
        organizationId,
      );
    };
    addAuditLog();
  }

  return createdAudit;
};

auditsSchema.statics.customSearch = async function (searchQuery, user, organizationId): Promise<IAudit[]> {
  const { searchText } = searchQuery;
  const pipeline: any[] = [
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
      action: 'audits.viewAll',
    })
  ) {
    pipeline.push({
      $match: {
        $or: [{ auditorId: user._id }, { participantsIds: { $in: [user._id] } }],
      },
    });
  }

  // Join business unit
  join({
    pipeline,
    collection: 'businessUnits',
    from: 'businessUnitId',
    to: 'businessUnit',
  });

  // Filter by search text (in businessUnit)
  pipeline.push({
    $match: {
      'businessUnit.name': new RegExp(searchText, 'i'),
    },
  });

  join({
    pipeline,
    collection: 'locations',
    from: 'locationId',
    to: 'location',
  });

  pipeline.push({
    $limit: 5,
  });

  pipeline.push({
    $project: {
      _id: 1,
      auditorId: 1,
      title: '$businessUnit.name',
      type: 'audits',
    },
  });

  let data = await this.aggregate(pipeline);
  const organization = await Organizations.customFindById(organizationId);

  data = await Promise.all(
    data.map(async (audit) => {
      if (!audit.auditorId) return audit;
      try {
        return {
          ...audit,
          user: await Users.customFindByIdWithDetails({
            userId: audit?.auditorId,
            organization,
          }),
        };
      } catch (e) {
        console.log(`Error occured for audit with ID ${audit._id}: ${e}`);
        return audit;
      }
    }),
  );

  return data;
};

auditsSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAudit[]> {
  const audits = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audits;
};

auditsSchema.statics.customFindOne = async function (selector: any = {}, organizationId: string): Promise<IAudit | null> {
  const audit = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return audit;
};

auditsSchema.statics.customFindById = async function (_id: string): Promise<IAudit> {
  const audit = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!audit) throw new Error('Audit not found');

  return audit;
};

auditsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IAudit>,
  userId: string,
  organizationId: string,
): Promise<IAudit> {
  const audit = await this.customFindOne(selector, organizationId);
  if (!audit) throw new GraphQLError("Audit doesn't exist");

  // Add auditor and participants to the database if doesn't exist
  const usersIds = updates.participantsIds || [];
  if (updates.auditorId) usersIds.push(updates.auditorId);
  await Promise.all(uniq(usersIds).map(async (userId) => Users.customAssertUser({ userId, organizationId })));

  const updatedAudit = {
    ...audit,
    ...updates,
    metatags: {
      ...audit?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedAudit);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = {
        _id: audit._id,
        name: 'Virtual',
      };
      if (audit.businessUnitId) {
        const businessUnit = await BusinessUnits.customFindById(audit.businessUnitId, organizationId);
        element.name = businessUnit.name;
      }
      const oldValues = removeDatabaseFields(audit);
      const newValues = removeDatabaseFields(updatedAudit);
      const organization = await Organizations.customFindById(organizationId);
      const values = await getAuditRecordValues({
        oldValues,
        newValues,
        organization,
      });
      AuditLogs.customAudit(
        {
          coll: 'audits',
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

  return updatedAudit;
};

auditsSchema.statics.customDelete = async function (selector: object = {}, userId: string, organizationId: string): Promise<number> {
  const audit = await this.customFindOne(selector, organizationId);
  if (!audit) throw new GraphQLError("Audit doesn't exist");

  const updatedAudit = {
    ...audit,
    metatags: {
      ...audit?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedAudit);

  if (deletedResult?.modifiedCount) {
    await Promise.all([
      answersModel.customDeleteMany({ 'scope._id': audit._id }, userId, organizationId),
      questionModel.customDeleteMany({ 'scope._id': audit._id }, userId, organizationId),
    ]);

    const addAuditLog = async () => {
      const element = {
        _id: audit._id,
        name: 'Virtual',
      };
      if (audit.businessUnitId) {
        const businessUnit = await BusinessUnits.customFindById(audit.businessUnitId, organizationId);
        element.name = businessUnit.name;
      }
      const oldValues = removeDatabaseFields(updatedAudit);
      const organization = await Organizations.customFindById(organizationId);
      const values = await getAuditRecordValues({
        oldValues,
        organization,
      });
      AuditLogs.customAudit(
        {
          coll: 'audits',
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

const auditsModel = model<IAudit, IAuditModel>('Audit', auditsSchema);

export default auditsModel;
