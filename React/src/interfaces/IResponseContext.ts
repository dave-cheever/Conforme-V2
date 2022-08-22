import { Dispatch, SetStateAction } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { gqlFunction } from '../types/gqlFunction';
import { IResponse } from './IResponse';
import { IUser } from './IUser';

export interface IResponseContext {
  response: IResponse;
  users: IUser[];
  loading: boolean;
  refetch: () => void;

  activeTab: number;
  setActiveTab(tab: number): void;

  isQuestionFormDirty: boolean;
  setIsQuestionFormDirty: Dispatch<SetStateAction<boolean>>;

  isShareOpen: boolean;
  handleShareOpen: () => void;
  handleShareClose: () => void;

  getUpdatedDisplayName: (userId: string) => string;
  getParticipantDetailById: (userId: string) => IUser;

  isConfirmationOpen: boolean;
  handleConfirmationOpen: () => void;
  handleConfirmationClose: () => void;

  isRenewalOpen: boolean;
  handleRenewalOpen: () => void;
  handleRenewalClose: () => void;

  isDueDateOpen: boolean;
  handleDueDateOpen: () => void;
  handleDueDateClose: () => void;

  participantsLoading: boolean;
  snapshot: string | null;
  snapshots: IResponse[];
  snapshotsLoading: boolean;

  questionsForm: UseFormReturn;
  updateQuestions: gqlFunction;
  submitResponse: gqlFunction;
}
