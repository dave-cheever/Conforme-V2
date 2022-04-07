import { IAuditLog } from "./IAuditLog";
import { IBaseModel } from "./IBaseModel";

export interface IAuditLogModel extends IBaseModel<IAuditLog> {
  customAudit: (
    auditLog: Partial<IAuditLog>,
    userId: string,
    organizationId: string
  ) => Promise<IAuditLog>;
}
