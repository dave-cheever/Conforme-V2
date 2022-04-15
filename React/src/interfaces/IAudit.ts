import { IAuditType } from './IAuditType';
import { IBase } from './IBase';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IUser } from './IUser';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: 'inProgress' | 'completed';
  dueDate: Date;
  walkType: 'physical' | 'virtual';
  auditType: IAuditType;
  site: ILocation;
  area?: IBusinessUnit;
  auditor: IUser;
  participants: IUser[];
  siteId: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
}
