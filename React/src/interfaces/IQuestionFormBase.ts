import { Dispatch, SetStateAction } from "react";
import { IQuestion, IQuestionValue } from "./IQuestion";

export interface IQuestionFormBase<IEditableValue> {
  questionType: string;
  editQuestionIndex: number | undefined;
  addOrUpdateQuestion: (arg: object) => void;
  setShowQuestionForm: (arg: boolean) => void;
  editableValue: Partial<IQuestion<IEditableValue>>;
  setIsEdit: Dispatch<SetStateAction<boolean | undefined>>;
  setEditQuestionIndex: Dispatch<SetStateAction<number | undefined>>;
  setEditQuestion: Dispatch<SetStateAction<IQuestionValue>>;
}