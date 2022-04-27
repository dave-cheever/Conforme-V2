import {
  IAuditType,
  IBase,
  IBusinessUnit,
  ILocation,
  IQuestion,
  IUser,
} from 'app-interfaces';

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

  // Additional fields
  auditType?: IAuditType;
  site?: ILocation;
  area?: IBusinessUnit;
  auditor?: IUser;
  participants?: IUser[];
  questions?: IQuestion<any>[];
}
