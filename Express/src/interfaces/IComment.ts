import { IBase } from "app-interfaces";

export interface IComment extends IBase {
  responseId: string;
  text: string;
  authorId: string;
}
