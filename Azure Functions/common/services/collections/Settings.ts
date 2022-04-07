import { model, Schema } from "mongoose";

import { ISetting } from "../../interfaces/ISetting";
import { ISettingModel } from "../../interfaces/ISettingModel";
import { genMetatags } from "../../utils";
import AuditLogs from "./AuditLogs";

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
    removedBy: String,
  },
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

settingSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<ISetting | null> {
  const setting = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return setting;
};

settingSchema.statics.customFindById = async function (
  _id: string,
  organizationId: string
): Promise<ISetting> {
  const setting = await this.findOne({
    _id,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!setting) throw new Error("Setting not found");

  return setting;
};

settingSchema.statics.customFindByType = async function (
  type: string,
  organizationId: string | string[]
): Promise<ISetting[]> {
  const settings = await this.find({
    type,
    organizationId:
      typeof organizationId === "string"
        ? organizationId
        : { $in: organizationId },
    "metatags.removedAt": { $eq: null },
  }).lean();
  return settings;
};

settingSchema.statics.customFindByName = async function (
  name: string,
  organizationId: string | string[]
): Promise<ISetting[]> {
  const settings = await this.find({
    name,
    organizationId:
      typeof organizationId === "string"
        ? organizationId
        : { $in: organizationId },
    "metatags.removedAt": { $eq: null },
  }).lean();
  return settings;
};

settingSchema.statics.customFindOneByName = async function (
  name: string,
  organizationId: string | string[]
): Promise<ISetting> {
  const settings = await this.customFindByName(name, organizationId);
  return settings[0];
};

const settingsModel = model<ISetting, ISettingModel>("Setting", settingSchema);
export default settingsModel;
