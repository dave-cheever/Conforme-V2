import { IBase } from './IBase';
import { IDocument } from './IResponse';
import { IScope } from './IScope';
import { TQuestionValue } from './TQuestionValue';

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
