import { IBase } from './IBase';
import { IScope } from './IScope';

export interface IComment extends IBase {
  responseId: string;
  text: string;
  authorId: string;
  scope: IScope;
}
