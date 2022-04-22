import { Dispatch, SetStateAction } from 'react';

import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from '@apollo/client';

import {
  IQuestionsByCategories,
  TQuestionWithAnswer,
} from '../contexts/AuditProvider';
import { IAction } from './IAction';
import { IAudit } from './IAudit';
import { IAuditType } from './IAuditType';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IQuestionsCategory } from './IQuestionsCategory';
import { IUser } from './IUser';
import { TDeepPartial } from './TDeepPartial';

export interface IAuditContext {
  audit: IAudit;
  auditType: IAuditType;
  auditor: IUser;
  participants: IUser[];
  site: ILocation;
  area?: IBusinessUnit;
  questionsCategories: IQuestionsCategory[];
  customQuestionsCategories: IQuestionsCategory[];
  questions: IQuestionsByCategories;
  loading: boolean;

  selectedQuestion?: TDeepPartial<TQuestionWithAnswer>;
  setSelectedQuestion: Dispatch<
    SetStateAction<TDeepPartial<TQuestionWithAnswer> | undefined>
  >;

  selectedAction?: Partial<IAction>;
  setSelectedAction: Dispatch<SetStateAction<Partial<IAction> | undefined>>;

  createCustomQuestionAndAnswer: (
    questionValues: TDeepPartial<TQuestionWithAnswer>,
  ) => Promise<{ questionId: string; answerId?: string }>;
  saveCustomQuestionAndAnswer: (
    questionValues: TDeepPartial<TQuestionWithAnswer>,
  ) => Promise<void>;
  deleteCustomQuestionAndAnswer: (
    questionValues: TDeepPartial<TQuestionWithAnswer>,
  ) => Promise<void>;
  updateActions: (
    actions: Partial<IAction>[],
    answerId: string,
  ) => Promise<void>;

  updateAudit: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      DefaultContext,
      ApolloCache<any>
    >,
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  submitAudit: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      DefaultContext,
      ApolloCache<any>
    >,
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;

  refetch: () => void;
}
