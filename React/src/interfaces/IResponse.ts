import { IBase } from "./IBase";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { IComment } from "./IComment";
import { IQuestion } from "./IQuestion";
import { IUser } from "./IUser";

export interface IDocument {
  path?: string;
  name: string;
  addedAt: Date;
  id: string;
}

export interface IEvidence {
  id: string;
  name: string;
  uploaded?: IDocument;
}

export interface IResponse extends IBase {
  complianceItemId: string;
  businessUnitId: string;
  delegateIds: string[];
  lastRenewalDate: Date;
  nextRenewalDate: Date;
  status: string;
  actionPlanSubmitted: boolean;
  evidenceExpected: IEvidence[];
  previousEvidence: IEvidence[];
  attachments: IDocument[];
  verified: boolean;
  comments: IComment[];
  daysToDueDate?: number;
  actionExpected?: boolean;
  businessUnit?: IBusinessUnit;
  owner?: IUser;
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  functionalArea?: IBaseWithName;
  delegates?: IUser[];
  questions?: IQuestion[];
  complianceItem: any;
}
