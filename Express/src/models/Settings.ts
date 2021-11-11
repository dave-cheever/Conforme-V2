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

settingSchema.statics.getByType = async function (type: string): Promise<ISetting[]> {
  const settings = await this.find({ type });
  return settings.map(setting => setting._doc);
}

const settingsModel = model<ISetting, ISettingModel>('Setting', settingSchema);
export default settingsModel;
