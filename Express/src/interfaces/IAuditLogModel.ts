import { IAuditLog, IBaseModel } from 'app-interfaces';

export interface IAuditLogModel extends IBaseModel<IAuditLog> {
  customAudit: (
    auditLog: Partial<IAuditLog>,
    userId: string,
    organizationId: string,
    moduleId?: string
  ) => Promise<IAuditLog>;
}
