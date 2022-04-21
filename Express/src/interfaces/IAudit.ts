import { IBase } from 'app-interfaces';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: 'inProgress' | 'completed';
  dueDate: Date;
  walkType: 'physical' | 'virtual';
  siteId?: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
  organizationId: string;
}
