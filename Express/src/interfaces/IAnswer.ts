import { IBase, IDocument, IScope, TQuestionValue } from 'app-interfaces';

export interface IAnswer extends IBase {
  questionId: string;
  answer?: TQuestionValue;
  attachments?: IDocument[];
  status?: 'open' | 'ignored' | 'closed';
  options?: {
    [name: string]: boolean;
  };
  scope: IScope;
}
