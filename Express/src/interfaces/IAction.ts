import { IBase } from 'app-interfaces';

export interface IAction extends IBase {
  title: string;
  auditId: string;
  dueDate: Date;
  done: boolean;
  priority: 'low' | 'medium' | 'high';
  description: string;
  assignedId: string;
  organizationId: string;
}
