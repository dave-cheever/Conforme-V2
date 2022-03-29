import { IBase } from './IBase';
import { TComponent } from './TComponent';

export interface IQuestionsCategory extends IBase {
  name: string;
  auditType?: string;
  withAnswers: boolean;
  allowCustomQuestions: boolean;
  maxQuestionsNumber: number;
  scope: {
    component: TComponent;
    type?: string;
    _id?: string;
  };
  organizationId: string;
}
