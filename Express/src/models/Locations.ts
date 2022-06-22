import { diff } from 'deep-object-diff';
import { GraphQLError } from 'graphql';
import { model, models, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { IAuditValues, ILocation, ILocationModel } from 'app-interfaces';
import { AuditLogs, Organizations, Users } from 'app-models';
import {
  genMetatags,
  getAuditValueForString,
  getAuditValueForUser,
  getBasicElement,
  removeDatabaseFields,
} from 'app-utils';

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

// custom validation for unique name
async function validateUniqueName(this: any, name: string) {
  const locationsCount = await models.Location.find({
    name,
    'metatags.removedAt': { $eq: null },
  }).count();
  return !locationsCount;
}

const locationsSchema = new Schema<ILocation, ILocationModel>({
  _id: String,
  name: {
    type: String,
    validate: [validateUniqueName, 'Location name already exists'],
  },
  ownerId: String,
  organizationId: String,
  notes: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

locationsSchema.statics.customCreate = async function (
  location: ILocation,
  userId: string,
  organizationId: string,
): Promise<ILocation> {
  // Add owner to the database if doesn't exist
  await Users.customAssertUser({ userId: location.ownerId, organizationId });

  const createdLocation = await this.create({
    ...location,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags('added', userId),
  });

  if (createdLocation?._doc) {
    const addAuditLog = async () => {
      const element = getBasicElement(createdLocation._doc);
      const newValues = removeDatabaseFields(createdLocation._doc);
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId,
      );
      const values = await getAuditRecordValues({ newValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'locations',
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
  return createdLocation;
};

locationsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId,
): Promise<ILocation[]> {
  const locations = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  });
  return locations;
};

locationsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<ILocation | null> {
  const location = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return location;
};

locationsSchema.statics.customFindById = async function (
  _id: string,
): Promise<ILocation> {
  const location = await this.findOne({
    _id,
    'metatags.removedAt': { $eq: null },
  });
  if (!location) throw new Error('Location not found');

  return location._doc;
};

locationsSchema.statics.customFindByOwnerId = async function (
  ownerId: string,
  organizationId: string,
): Promise<ILocation> {
  const location = await this.customFindOne({ ownerId }, organizationId);
  if (!location) throw new Error('Location not found');

  return location._doc;
};

locationsSchema.statics.customFindByOrganizationId = async function (
  organizationId: string,
): Promise<ILocation> {
  const location = await this.customFindOne({ organizationId }, organizationId);
  if (!location) throw new Error('Location not found');

  return location._doc;
};

locationsSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<ILocation>,
  userId: string,
  organizationId: string,
): Promise<ILocation> {
  const location = await this.customFindOne(selector, organizationId);
  if (!location) throw new GraphQLError("Location doesn't exist");

  const updatedLocation = {
    ...location,
    ...updates,
    metatags: {
      ...location?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedLocation);

  // Add owner to the database if doesn't exist
  await Users.customAssertUser({ userId: updatedLocation.ownerId, organizationId });

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedLocation);
      const oldValues = removeDatabaseFields(location);
      const newValues = removeDatabaseFields(updatedLocation);
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
          coll: 'locations',
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

  return updatedLocation;
};

locationsSchema.statics.customDelete = async function (
  selector: object = {},
  userId: string,
  organizationId: string,
): Promise<number> {
  const location = await this.customFindOne(selector, organizationId);
  if (!location) throw new GraphQLError("Location doesn't exist");

  const updatedLocation = {
    ...location,
    metatags: {
      ...location?.metatags,
      ...genMetatags('removed', userId),
    },
  };
  const deletedResult = await this.updateOne(selector, updatedLocation);

  if (deletedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(location);
      const oldValues = removeDatabaseFields(location);
      const organization = await Organizations.customFindById(
        organizationId,
        organizationId,
      );
      const values = await getAuditRecordValues({ oldValues, organization });
      AuditLogs.customAudit(
        {
          coll: 'locations',
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

const locationModel = model<ILocation, ILocationModel>(
  'Location',
  locationsSchema,
);
export default locationModel;
