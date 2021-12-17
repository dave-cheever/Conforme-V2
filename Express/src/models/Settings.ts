import { model, Schema } from 'mongoose';

import { ISetting, ISettingModel } from 'app-interfaces';

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
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

settingSchema.statics.customFindById = async function (_id: string, organizationId: string): Promise<ISetting> {
  const setting = await this.findOne({
    _id,
    organizationId,
    "metatags.removedAt": { $eq: null }
  }).lean();
  if (!setting) {
    throw new Error("Setting not found");
  }
  return setting;
};

settingSchema.statics.customFindByType = async function (type: string, organizationId: string): Promise<ISetting[]> {
  const settings = await this.find({ type, organizationId }).lean();
  return settings;
}

const settingsModel = model<ISetting, ISettingModel>('Setting', settingSchema);
export default settingsModel;
