import { IAnswer } from './IAnswer';
import { IBase } from './IBase';
import { IDocument } from './IDocument';
import { IScope } from './IScope';

export interface IAction extends IBase {
  title: string;
  dueDate?: Date;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assigneeId?: string;
  attachments?: IDocument[];
  scope: IScope;

  // Additional fields - can be added in the API
  answer?: IAnswer; // can be injected if scope type is 'answer'
}
