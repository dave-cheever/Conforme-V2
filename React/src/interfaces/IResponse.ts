import { IBase } from "./IBase";
import { IBusinessUnit } from "./IBusinessUnit";
import { IComment } from "./IComment";
import { IComplianceItem } from "./IComplianceItem";
import { IQuestion } from "./IQuestion";

export interface IDocument {
  id: string;
  name: string;
  addedAt: Date;
  path?: string;
  thumbnail?: string;
}

export interface IEvidence {
  name: string;
  uploaded?: IDocument;
  outdated?: boolean;
}

export interface IResponse extends IBase {
  // Base fields - saved for response in database
  complianceItemId: string;
  businessUnitId: string;
  lastRenewalDate: Date | null;
  nextRenewalDate: Date | null;
  status: string;
  evidence: IEvidence[];
  attachments: IDocument[];
  questions: IQuestion[];
  accountableId: string;
  responsibleId: string;
  contributorsIds?: string[];
  followersIds?: string[];
  published: boolean;
  
  // Comments - injected to response when getting from database
  // Taken from Comments collection
  comments: IComment[];
  
  // Compliance items fields - injected to response when getting from database
  complianceItem: IComplianceItem;

  // Additional fields - can be added when getting from database
  daysToDueDate?: number;
  businessUnit?: IBusinessUnit;
}
