import { Dispatch, SetStateAction } from 'react';

import { ITrackerQuestion } from './ITrackerQuestion';
import { TQuestionValue } from './TQuestionValue';

export interface IQuestionFormBase<IEditableValue> {
  questionType: string;
  editQuestionIndex: number | undefined;
  addOrUpdateQuestion: (arg: object) => void;
  setShowQuestionForm: (arg: boolean) => void;
  editableValue: Partial<ITrackerQuestion<IEditableValue>>;
  setIsEdit: Dispatch<SetStateAction<boolean | undefined>>;
  setEditQuestionIndex: Dispatch<SetStateAction<number | undefined>>;
  setEditQuestion: Dispatch<SetStateAction<TQuestionValue>>;
}
