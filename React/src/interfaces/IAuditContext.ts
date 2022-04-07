import { IAudit } from './IAudit';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IUser } from './IUser';

export interface IAuditContext {
  audit: IAudit;
  auditor: IUser;
  participants: IUser[];
  site: ILocation;
  area?: IBusinessUnit;
  loading: boolean;
  refetch: () => void;
}
