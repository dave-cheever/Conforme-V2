import { IBase, IWithName } from "./IBase";
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
  categoryId: string;
  functionalAreaId: string;
  regulatoryBodyId: string;
  delegateIds: string[];
  lastRenewalDate: Date;
  nextRenewalDate: Date;
  reference: string;
  status: string;
  actionPlanSubmitted: boolean;
  evidenceExpected: IEvidence[];
  previousEvidence: IEvidence[];
  attachments: IDocument[];
  verified: boolean;
  comments: IComment[];
  name?: string;
  description?: string;
  daysToDueDate?: number;
  actionExpected?: boolean;
  frequency?: string;
  businessUnit?: IBusinessUnit;
  owner?: IUser;
  category?: IWithName;
  regulatoryBody?: IWithName;
  functionalArea?: IWithName;
  delegates?: IUser[];
  questions?: IQuestion[];
}
