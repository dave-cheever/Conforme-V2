import { IAuditType, IBase, IBusinessUnit, ILocation, IQuestion, IScope, IUser, TAuditStatus } from 'app-interfaces';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: TAuditStatus;
  dueDate: Date; // Calculated base on auditType frequency, start date and status
  completedDate?: Date;
  walkType: 'physical' | 'virtual';
  siteId?: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
  scope: IScope;

  // Additional fields
  auditType?: IAuditType;
  site?: ILocation;
  area?: IBusinessUnit;
  auditor?: IUser;
  participants?: IUser[];
  questions?: IQuestion<any>[];
  numberOfActions?: number;
}
