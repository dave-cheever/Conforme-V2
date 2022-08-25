import { IBase } from "./IBase";
import { IUser } from "./IUser";

export interface IBusinessUnit extends IBase {
  identifier: string;
  name: string;
  ownerId: string;
  imgUrl?: string;
  organizationId: string;

  // Additional fields - can be added when getting from database
  trackerItemsResponsesCount?: number;
  totalAuditsCount?: number;
  owner?: IUser;
}
