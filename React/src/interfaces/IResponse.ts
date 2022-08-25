import { IBase } from './IBase';
import { IBusinessUnit } from './IBusinessUnit';
import { IComment } from './IComment';
import { ITrackerItem } from './ITrackerItem';
import { ITrackerQuestion } from './ITrackerQuestion';
import { IUser } from './IUser';
import { TQuestionValue } from './TQuestionValue';

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
}

export interface IResponse extends IBase {
  // Base fields - saved for response in database
  trackerItemId: string;
  businessUnitId: string;
  lastCompletionDate: Date | null;
  dueDate: Date | null;
  status: 'draft' | 'submitted';
  calculatedStatus: 'compliant' | 'nonCompliant' | 'comingUp';
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

  // Additional fields - can be added when getting from database
  daysToDueDate?: number;
  businessUnit?: IBusinessUnit;
  responsible?: IUser;
  accountable?: IUser;
  contributors?: IUser[];
  followers?: IUser[];
}
