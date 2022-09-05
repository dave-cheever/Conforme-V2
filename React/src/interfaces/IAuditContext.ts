import { Dispatch, SetStateAction } from 'react';

import { ApolloCache, DefaultContext, FetchResult, MutationFunctionOptions, OperationVariables } from '@apollo/client';

import { IQuestionsByCategories, TQuestionWithAnswer } from '../contexts/AuditProvider';
import { gqlFunction } from '../types/gqlFunction';
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
  location: ILocation;
  businessUnit?: IBusinessUnit;
  questionsCategories: IQuestionsCategory[];
  customQuestionsCategories: IQuestionsCategory[];
  questions: IQuestionsByCategories;
  loading: boolean;

  selectedQuestion?: TDeepPartial<TQuestionWithAnswer>;
  setSelectedQuestion: Dispatch<SetStateAction<TDeepPartial<TQuestionWithAnswer> | undefined>>;

  selectedAction?: Partial<IAction>;
  setSelectedAction: Dispatch<SetStateAction<Partial<IAction> | undefined>>;

  isActionChangesModalOpen: boolean;
  handleActionChangesModalOpen: () => void;
  handleActionChangesModalClose: () => void;

  actionChangesModalOnContinue: Function | undefined;
  setActionChangesModalOnContinue: Dispatch<SetStateAction<Function | undefined>>;

  createQuestion: gqlFunction;
  saveQuestion: gqlFunction;
  deleteQuestion: gqlFunction;
  createAnswer: gqlFunction;
  saveAnswer: gqlFunction;
  deleteAnswer: gqlFunction;
  createAction: gqlFunction;
  saveAction: gqlFunction;
  deleteAction: gqlFunction;

  updateAudit: (
    options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  submitAudit: (
    options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
  deleteAudit: (
    options?: MutationFunctionOptions<any, OperationVariables, DefaultContext, ApolloCache<any>>,
  ) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;

  refetch: () => void;
}
