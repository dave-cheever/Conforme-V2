import { IBaseModel, IQuestion } from 'app-interfaces';

import { TQuestionValue } from './TQuestionValue';

export interface IQuestionModel extends IBaseModel<IQuestion<TQuestionValue>> { }
