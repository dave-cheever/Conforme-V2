import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, models, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import {
  IAuditValues,
  IBusinessUnit,
  IBusinessUnitModel,
} from 'app-interfaces';
import { AuditLogs, Organizations, Users } from 'app-models';
import {
  genMetatags,
  getAuditValueForString,
  getAuditValueForUser,
  getBasicElement,
  removeDatabaseFields,
} from 'app-utils';

// custom validation for unique name
async function validateUniqueName(this: any, name: string) {
  const buCount = await models.BusinessUnit.find({
    name,
    organizationId: this.organizationId,
    'metatags.removedAt': { $eq: null },
  }).count();
  return !buCount;
}

const businessUnitSchema = new Schema<IBusinessUnit, IBusinessUnitModel>({
  _id: String,
  identifier: String,
  name: {
    type: String,
    validate: [validateUniqueName, 'Business unit already exists'],
  },
  ownerId: String,
  imgUrl: String,
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
  organization,
}): Promise<IAuditValues> => {
  // It takes all the differencies between old and new object
  const differencies = diff(oldValues, newValues);
  const fields = Object.keys(differencies);

  // and fills the audit record obejct with these differencies
  const auditRecordValuesPromise = fields.reduce(async (accP, field) => {
    const acc = await accP;
    let value = {};

    switch (field) {
      // If updated 'ownerId' field, set user's ID as value and full name as label
      case 'ownerId':
        value = await getAuditValueForUser({
          oldValue: oldValues[field],
          newValue: newValues[field],
          organization,
        });
        break;

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

businessUnitSchema.statics.customCreate = async function (
  businessUnit: IBusinessUnit,
  userId: string,
  organizationId: string,
): Promise<IBusinessUnit> {
  // Add owner to the database if doesn't exist
  if (businessUnit.ownerId)
    await Users.customAssertUser({ userId: businessUnit.ownerId, organizationId });

  const createdBusinessUnit = await this.create({
    ...businessUnit,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdBusinessUnit?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdBusinessUnit._doc);
      const newValues = removeDatabaseFields(createdBusinessUnit._doc);
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId,
      );
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'businessUnits',
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
  return createdBusinessUnit;
};

businessUnitSchema.statics.customFind = async function (
  selector: any = {},
  organizationId,
): Promise<IBusinessUnit[]> {
  const businessUnits = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return businessUnits;
};

businessUnitSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<IBusinessUnit | null> {
  const businessUnit = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return businessUnit;
};

businessUnitSchema.statics.customFindById = async function (
  _id: string,
): Promise<IBusinessUnit> {
  const businessUnit = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!businessUnit) throw new Error('Business Unit not found');

  return businessUnit;
};

businessUnitSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<IBusinessUnit>,
  userId: string,
  organizationId: string,
): Promise<IBusinessUnit> {
  const businessUnit = await this.customFindOne(selector, organizationId);
  if (!businessUnit) throw new GraphQLError("Business Unit doesn't exist");

  const updatedBusinessUnit = {
    ...businessUnit,
    ...updates,
    metatags: {
      ...businessUnit?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedBusinessUnit);

  // Add owner to the database if doesn't exist
  if (updatedBusinessUnit.ownerId)
    await Users.customAssertUser({ userId: updatedBusinessUnit.ownerId, organizationId });

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedBusinessUnit);
      const oldValues = removeDatabaseFields(businessUnit);
      const newValues = removeDatabaseFields(updatedBusinessUnit);
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId,
      );
      const values = await getAuditRecordValues({
        oldValues,
        newValues,
        organization,
      });
      AuditLogs.customAudit(
        {
          coll: 'businessUnits',
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

  return updatedBusinessUnit;
};

businessUnitSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const businessUnit = await this.customFindOne(selector, organizationId);
  if (!businessUnit) throw new GraphQLError("Business Unit doesn't exist");

  const updatedBusinessUnit = {
    ...businessUnit,
    metatags: {
      ...businessUnit?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedBusinessUnit);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(businessUnit);
      const oldValues = removeDatabaseFields(businessUnit);
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId,
      );
      const values = await getAuditRecordValues({ oldValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'businessUnits',
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

const businessModel = model<IBusinessUnit, IBusinessUnitModel>(
  'BusinessUnit',
  businessUnitSchema,
  'businessUnits',
);
export default businessModel;
