import {
  IBase,
  IBusinessUnit,
  IComment,
  IDocument,
  ITrackerItem,
  ITrackerQuestion,
  IUser,
  TQuestionValue,
} from 'app-interfaces';

export interface IEvidence {
  name: string;
  uploaded?: IDocument;
}

export interface IResponse extends IBase {
  // Base fields - saved for response in database
  trackerItemId: string;
  businessUnitId: string;
  lastCompletionDate: Date | null;
  dueDate: Date | null;
  status: 'draft' | 'submitted';
  evidence: IEvidence[];
  attachments: IDocument[];
  questions: ITrackerQuestion<TQuestionValue>[];
  accountableId: string;
  responsibleId: string;
  contributorsIds?: string[];
  followersIds?: string[];
  published: boolean;

  // Comments - injected to response when getting from database
  // Taken from Comments collection
  comments: IComment[];

  // Tracker items fields - injected to response when getting from database
  trackerItem: ITrackerItem;

  // Additional fields - added when getting from database
  calculatedStatus: 'compliant' | 'nonCompliant' | 'comingUp';
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
