import {
  IAction,
  IAudit,
  IBase,
  IDocument,
  IQuestion,
  IScope,
  TAnswerStatus,
  TQuestionValue,
} from 'app-interfaces';

export interface IAnswer extends IBase {
  questionId: string;
  answer?: TQuestionValue;
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
