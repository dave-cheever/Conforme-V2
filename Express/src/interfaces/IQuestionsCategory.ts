import { IBase, TComponent } from 'app-interfaces';

export interface IQuestionsCategory extends IBase {
  name: string;
  withAnswers: boolean;
  allowCustomQuestions: boolean;
  maxQuestionsNumber: number;
  icon: string;
  scope: {
    component: TComponent;
    type?: string;
    _id?: string;
  };
  organizationId: string;
}
