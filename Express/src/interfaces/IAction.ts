import { IBase, IScope } from 'app-interfaces';

export interface IAction extends IBase {
  title: string;
  dueDate: Date;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string;
  assignedId: string;
  scope: IScope;
}
