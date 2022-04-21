import {
  IBase,
  IDocument,
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
}
