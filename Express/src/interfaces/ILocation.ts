import { IBase, IUser } from 'app-interfaces';

export interface ILocation extends IBase {
  _id: string;
  name: string;
  ownerId: string;
  organizationId: string;
  notes: string;

  // Additional fields - can be added when getting from database
  owner?: IUser;
  complianceItemsResponsesCount?: number;
}
