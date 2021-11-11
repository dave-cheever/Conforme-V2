import { IBase, IBaseWithName, IBusinessUnit, IUser, IQuestion, IComment } from 'app-interfaces';

export interface IDocument {
  id: string;
  name: string;
  addedAt: Date;
}

export interface IEvidence {
  name: string;
  uploaded?: IDocument;
  outdated?: boolean;
}

interface IComplianceItem {
  reference: string;
  name: string;
  description: string;
  categoryId: string;
  functionalAreaId: string;
  regulatoryBodyId: string;
  frequency: string;
}

export interface IResponse extends IBase {
  // Base fields - saved for response in database
  complianceItemId: string;
  businessUnitId: string;
  delegateIds: string[];
  lastRenewalDate: Date | null;
  nextRenewalDate: Date | null;
  status: string;
  evidence: IEvidence[];
  attachments: IDocument[];
  questions: IQuestion[];
  published: boolean;
  
  // Comments - injected to response when getting from database
  // Taken from Comments collection
  comments: IComment[];
  
  // Compliance items fields - injected to response when getting from database
  complianceItem: IComplianceItem;

  // Additional fields - can be added when getting from database
  daysToDueDate?: number;
  businessUnit?: IBusinessUnit;
  owner?: IUser;
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  functionalArea?: IBaseWithName;
  delegates?: IUser[];
}

export interface IAddtionalFields {
  region?: string;
  businessUnit?: string;
  businessUnitName?: string;
  imgUrl?: string;
  daysToDueDate?: number | null;
}
