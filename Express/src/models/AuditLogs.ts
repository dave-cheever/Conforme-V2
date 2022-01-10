import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IAuditLog, IAuditLogModel } from "app-interfaces";
import { genMetatags } from "app-utils";

const AuditLogSchema = new Schema<IAuditLog, IAuditLogModel>({
  _id: String,
  action: {
    type: String,
    enum: ["add", "update", "delete", "search"],
  },
  element: {
    _id: String,
    name: String,
    self_id: String, // Used if element is foreign element
  },
  coll: String,
  values: Schema.Types.Mixed,
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

AuditLogSchema.statics.customAudit = async function (auditLog: Partial<IAuditLog>, userId: string, organizationId: string): Promise<IAuditLog> {
  const newAuditLog = {
    ...auditLog,
    _id: uuidv4(),
    organizationId,
    metatags: genMetatags("added", userId) as { addedBy: string; addedAt: Date },
  };
  const createdAuditLog = await this.create(newAuditLog);
  return createdAuditLog;
};

AuditLogSchema.statics.customFind = async function (selector: any = {}, organizationId: string): Promise<IAuditLog[]> {
  const auditLogs = await this.find({
    ...selector,
    organizationId,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return auditLogs;
};

const auditLogModel = model<IAuditLog, IAuditLogModel>("AuditLog", AuditLogSchema, "auditLogs");
export default auditLogModel;
