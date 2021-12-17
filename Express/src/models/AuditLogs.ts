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
    id: String,
    name: String,
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

AuditLogSchema.statics.customCreate = async function (document: IAuditLog): Promise<IAuditLog> {
  const auditLog = await this.create(document);
  return auditLog;
};

AuditLogSchema.statics.customFind = async function (selector: any = {}): Promise<IAuditLog[]> {
  const auditLogs = await this.find({
    ...selector,
    "metatags.removedAt": { $eq: null },
  }).lean();
  return auditLogs;
};

const auditLogModel = model<IAuditLog, IAuditLogModel>("AuditLog", AuditLogSchema, "auditLogs");
export default auditLogModel;
