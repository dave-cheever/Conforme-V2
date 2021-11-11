import { IBase, IGraphUser } from "app-interfaces";

export interface IComment extends IBase {
  responseId: string;
  text: string;
  author?: IGraphUser;
}
