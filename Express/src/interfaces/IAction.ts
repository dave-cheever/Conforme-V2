import { IAnswer, IBase, IDocument, IScope, IUser, TActionStatus } from 'app-interfaces';

export interface IAction extends IBase {
  title: string;
  dueDate?: Date;
  completedDate?: Date;
  status: TActionStatus;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assigneeId?: string;
  attachments?: IDocument[];
  scope: IScope;

  // Additional fields - can be added in the API
  assignee?: IUser;
  assignor?: IUser;
  answer?: IAnswer; // can be injected if scope type is 'answer'
}
