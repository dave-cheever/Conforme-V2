import { Dispatch, SetStateAction } from 'react';

import {
  IQuestionsByCategories,
  TQuestionWithAnswer,
} from '../contexts/AuditProvider';
import { IAudit } from './IAudit';
import { IAuditType } from './IAuditType';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IQuestionsCategory } from './IQuestionsCategory';
import { IUser } from './IUser';
import { TDeepPartial } from './TDeepPartial';
import { TQuestionType } from './TQuestionType';

export interface IAuditContext {
  audit: IAudit;
  auditType: IAuditType;
  auditor: IUser;
  participants: IUser[];
  site: ILocation;
  area?: IBusinessUnit;
  questionsCategories: IQuestionsCategory[];
  questions: IQuestionsByCategories;
  loading: boolean;
  selectedQuestion?: TQuestionWithAnswer;
  setSelectedQuestion: Dispatch<
    SetStateAction<TQuestionWithAnswer | undefined>
  >;
  addCustomQuestionAndAnswer: (question: {
    type: TQuestionType;
    questionsCategoryId: string;
  }) => Promise<void>;
  saveCustomQuestionAndAnswer: (
    question: TDeepPartial<TQuestionWithAnswer>,
  ) => Promise<void>;
  deleteCustomQuestionAndAnswer: (
    question: TQuestionWithAnswer,
  ) => Promise<void>;
  refetch: () => void;
}
