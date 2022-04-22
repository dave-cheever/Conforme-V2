import { IBase } from './IBase';
import { IScope } from './IScope';

export interface IAction extends IBase {
  title: string;
  dueDate?: Date;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assigneeId: string;
  scope: IScope;
}
