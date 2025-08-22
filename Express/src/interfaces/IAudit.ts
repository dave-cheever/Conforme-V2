import { IAuditType, IBase, IBusinessUnit, ILocation, IQuestion, IScope, IUser, TAuditStatus } from 'app-interfaces';

export interface IAudit extends IBase {
  auditTypeId: string;
  reference: string;
  status: TAuditStatus;
  dueDate: Date; // Calculated base on auditType frequency, start date and status
  completedDate?: Date;
  walkType: 'physical' | 'virtual';
  locationId?: string;
  businessUnitId?: string;
  auditorId: string;
  participantsIds: string[];
  recurring: boolean;
  scope: IScope;

  // Additional fields
  auditType?: IAuditType;
  location?: ILocation;
  businessUnit?: IBusinessUnit;
  auditor?: IUser;
  participants?: IUser[];
  questions?: IQuestion<any>[];
  numberOfActions?: number;
  answersCount?: number;
}
