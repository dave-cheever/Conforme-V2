import { IBase } from './IBase';
import { TModuleType } from './TModuleType';

export interface IQuestionsCategory extends IBase {
  name: string;
  withAnswers: boolean;
  allowCustomQuestions: boolean;
  maxQuestionsNumber: number;
  icon: string;
  scope: {
    component: TModuleType;
    type?: string;
    _id?: string;
  };
  organizationId: string;
}
