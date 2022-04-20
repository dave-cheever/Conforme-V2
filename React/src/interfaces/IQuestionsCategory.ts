import { IBase } from './IBase';
import { IScope } from './IScope';

export interface IQuestionsCategory extends IBase {
  name: string;
  withAnswers: boolean;
  allowCustomQuestions: boolean;
  maxQuestionsNumber: number;
  icon: string;
  options: {
    type: 'notification';
    name: string;
    value?: string;
  }[];
  scope: IScope;
  organizationId: string;
}
