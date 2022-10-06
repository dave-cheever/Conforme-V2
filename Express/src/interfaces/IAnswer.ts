import { IAction, IAudit, IBase, IBusinessUnit, IDocument, IQuestion, IScope, IUser, TAnswerStatus, TQuestionValue } from 'app-interfaces';

export interface IAnswer extends IBase {
  questionId: string;
  businessUnitId?: string;
  answer?: TQuestionValue;
  attachments?: IDocument[];
  status?: TAnswerStatus;
  options?: {
    [name: string]: boolean;
  };
  scope: IScope;

  // Additional fields - can be added in the API
  audit?: IAudit;
  businessUnit?: IBusinessUnit;
  question?: IQuestion<any>;
  actions?: IAction[];
  creator?: IUser;
}
