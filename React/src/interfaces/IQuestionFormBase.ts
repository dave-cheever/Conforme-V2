export interface IQuestionFormBase {
  questionType: string;
  addQuestion: (arg:object) => void;
  setShowQuestionForm: (arg:boolean) => void;
}