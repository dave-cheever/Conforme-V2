import { GraphQLError } from 'graphql';
import { model, Schema } from 'mongoose';

import { ISetting, ISettingModel } from 'app-interfaces';
import { AuditLogs } from 'app-models';
import {
  genMetatags,
  getAuditRecordValues,
  getBasicElement,
  removeDatabaseFields,
} from 'app-utils';

const settingSchema = new Schema<ISetting, ISettingModel>({
  _id: String,
  name: String,
  value: Schema.Types.Mixed,
  label: String,
  type: String,
  description: String,
  options: [String],
  organizationId: String,
  placeholder: String,
  inputType: String,
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
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

settingSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string,
): Promise<ISetting[]> {
  const settings = await this.find({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return settings;
};

settingSchema.statics.customFindByType = async function (
  type: string,
  organizationId: string,
): Promise<ISetting[]> {
  const settings = await this.find({
    type,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return settings;
};

settingSchema.statics.customFindByName = async function (
  name: string,
  organizationId: string,
): Promise<ISetting[]> {
  const settings = await this.find({
    name,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return settings;
};

settingSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string,
): Promise<ISetting | null> {
  const setting = await this.findOne({
    ...selector,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  return setting;
};

settingSchema.statics.customFindById = async function (
  _id: string,
  organizationId: string,
): Promise<ISetting> {
  const setting = await this.findOne({
    _id,
    organizationId,
    'metatags.removedAt': { $eq: null },
  }).lean();
  if (!setting) throw new Error('Setting not found');

  return setting;
};

settingSchema.statics.customFindOneByName = async function (
  name: string,
  organizationId: string | string[],
): Promise<ISetting> {
  const settings = await this.customFindByName(name, organizationId);
  return settings[0];
};

settingSchema.statics.customUpdateOne = async function (
  selector: object = {},
  updates: Partial<ISetting>,
  userId: string,
  organizationId: string,
): Promise<ISetting> {
  const setting = await this.customFindOne(selector, organizationId);
  if (!setting) throw new GraphQLError("Setting doesn't exist");

  const updatedSetting = {
    ...setting,
    ...updates,
    metatags: {
      ...setting?.metatags,
      ...genMetatags('updated', userId),
    },
  };
  const updatedResult = await this.updateOne(selector, updatedSetting);

  if (updatedResult?.modifiedCount) {
    const addAuditLog = async () => {
      const element = getBasicElement(updatedSetting);
      const oldValues = removeDatabaseFields(setting);
      const newValues = removeDatabaseFields(updatedSetting);
      const values = await getAuditRecordValues({ oldValues, newValues });
      AuditLogs.customAudit(
        {
          coll: 'settings',
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

  return updatedSetting;
};

const settingsModel = model<ISetting, ISettingModel>('Setting', settingSchema);
export default settingsModel;
