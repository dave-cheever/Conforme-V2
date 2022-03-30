import { IAuditType, IBase } from 'app-interfaces';

export interface IAudit extends IBase {
  name: string;
  type: IAuditType;
  walkType: 'physical' | 'virtual';
  siteId?: string;
  areaId?: string;
  answersIds: string[];
  actionsIds: string[];
  participantsIds: string[];
  organizationId: String;
}
