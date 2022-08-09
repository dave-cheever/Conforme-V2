import { IAuditType } from './IAuditType';
import { IBase } from './IBase';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IQuestion } from './IQuestion';
import { IScope } from './IScope';
import { IUser } from './IUser';
import { TAuditStatus } from './TAuditStatus';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: TAuditStatus;
  dueDate: Date;
  completedDate?: Date;
  walkType: 'physical' | 'virtual';
  siteId?: string;
  areaId?: string;
  auditorId: string;
  participantsIds: string[];
  recurring: boolean;
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
