import { IBase } from './IBase';
import { IUser } from './IUser';

export interface ILocation extends IBase {
  _id: string;
  name: string;
  ownerId: string;
  organizationId: string;
  notes: string;
  complianceItemsResponsesCount?: number;
  owner?: IUser;
}
