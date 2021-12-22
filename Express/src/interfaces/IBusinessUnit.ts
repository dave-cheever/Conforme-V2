import { IBase, IUser } from "app-interfaces";

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  type: string;
  region: string;
  ownerId: string;
  imgUrl?: string;
  organizationId: string;
  
  // Additional fields - can be added when getting from database
  complianceItemsResponsesCount?: number;
  owner?: IUser;
}
