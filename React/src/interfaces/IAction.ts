import { IAnswer } from './IAnswer';
import { IBase } from './IBase';
import { IDocument } from './IResponse';
import { IScope } from './IScope';
import { IUser } from './IUser';

export interface IAction extends IBase {
  title: string;
  dueDate?: Date;
  completedDate?: Date;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assigneeId: string;
  attachments?: IDocument[];
  scope: IScope;

  // Additional fields - can be added in the API
  assignee?: IUser;
  answer?: IAnswer; // can be injected if scope type is 'answer'
}
