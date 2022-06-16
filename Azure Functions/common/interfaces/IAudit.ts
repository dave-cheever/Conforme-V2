import { IAuditType } from './IAuditType';
import { IBase } from './IBase';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: 'inProgress' | 'completed';
  dueDate: Date;
  completedDate?: Date;
  walkType: 'physical' | 'virtual';
  siteId?: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
  organizationId: string;

  auditType?: IAuditType;
}
