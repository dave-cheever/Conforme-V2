import { IBase, IScope } from 'app-interfaces';

export interface IComment extends IBase {
  componentId: string;
  text: string;
  authorId: string;
  scope: IScope;
}
