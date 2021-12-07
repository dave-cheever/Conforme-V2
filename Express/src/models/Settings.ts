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

settingSchema.statics.getById = async function (_id: string, organizationId: string): Promise<ISetting> {

  const setting = await this.findOne({_id , organizationId,"metatags.removedAt": { $eq: null }});
  
  if (!setting) {
    throw new Error("Setting not found");
  }
  return setting._doc;
};

settingSchema.statics.getByType = async function (type: string, organizationId: string): Promise<ISetting[]> {
  const settings = await this.find({ type, organizationId });
  return settings.map(setting => setting._doc);
}

const settingsModel = model<ISetting, ISettingModel>('Setting', settingSchema);
export default settingsModel;
