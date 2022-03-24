import {
  IBase,
  IBusinessUnit,
  IComment,
  IComplianceItem,
  IQuestionValue,
  ITrackerQuestion,
  IUser,
} from 'app-interfaces';

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
  firstCompletionDate: Date | null;
  lastCompletionDate: Date | null;
  lastRenewalDate: Date | null;
  nextRenewalDate: Date | null;
  status: string;
  evidence: IEvidence[];
  attachments: IDocument[];
  questions: ITrackerQuestion<IQuestionValue>[];
  accountableId: string;
  responsibleId: string;
  contributorsIds?: string[];
  followersIds?: string[];
  published: boolean;
  organizationId: string;

  // Comments - injected to response when getting from database
  // Taken from Comments collection
  comments: IComment[];

  // Compliance items fields - injected to response when getting from database
  complianceItem: IComplianceItem;

  // Additional fields - can be added when getting from database
  daysToDueDate?: number;
  businessUnit?: IBusinessUnit;
  responsible?: IUser;
  accountable?: IUser;
  contributors?: IUser[];
  followers?: IUser[];
}

export interface IAddtionalFields {
  region?: string;
  businessUnit?: string;
  businessUnitName?: string;
  imgUrl?: string;
  daysToDueDate?: number | null;
}
