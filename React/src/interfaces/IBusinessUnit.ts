import { IBase } from "./IBase";
import { IUser } from "./IUser";

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  ownerId: string;
  imgUrl?: string;
  
  // Additional fields - can be added when getting from database
  complianceItemsResponsesCount?: number;
  owner?: IUser;
}
