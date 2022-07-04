import { IAction } from './IAction';
import { IAudit } from './IAudit';
import { IBase } from './IBase';
import { IQuestion } from './IQuestion';
import { IDocument } from './IResponse';
import { IScope } from './IScope';
import { IUser } from './IUser';
import { TAnswerStatus } from './TAnswerStatus';
import { TQuestionValue } from './TQuestionValue';

export interface IAnswer extends IBase {
  questionId: string;
  answer?: TQuestionValue;
  addedBy?: IUser;
  attachments?: IDocument[];
  status?: TAnswerStatus;
  options?: {
    [name: string]: boolean;
  };
  scope: IScope;

  // Additional fields - can be added in the API
  audit?: IAudit;
  question?: IQuestion<any>;
  actions?: IAction[];
}
