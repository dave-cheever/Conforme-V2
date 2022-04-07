import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IAudit } from "../../interfaces/IAudit";
import { IAuditModel } from "../../interfaces/IAuditModel";
import { genMetatags } from "../../utils";

const auditsSchema = new Schema<IAudit, IAuditModel>({
  _id: String,
  auditTypeId: String,
  walkType: {
    type: String,
    enum: ["physical", "virtual"],
  },
  siteId: String,
  areaId: String,
  auditorId: String,
  participantsIds: [String],
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

auditsSchema.statics.customFind = async function (
  selector: any = {},
  organizationId: string
): Promise<IAudit[]> {
  const audits = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return audits;
};

auditsSchema.statics.customFindOne = async function (
  selector: any = {},
  organizationId: string
): Promise<IAudit | null> {
  const audit = await this.findOne({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return audit;
};

auditsSchema.statics.customFindById = async function (
  _id: string
): Promise<IAudit> {
  const audit = await this.findOne({
    _id,
    "metatags.removedAt": { $eq: null },
  }).lean();
  if (!audit) throw new Error("Audit not found");

  return audit;
};

const auditsModel = model<IAudit, IAuditModel>("Audit", auditsSchema);

export default auditsModel;
