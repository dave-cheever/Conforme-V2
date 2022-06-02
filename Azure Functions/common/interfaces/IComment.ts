import { IBase } from "./IBase";

export interface IComment extends IBase {
  responseId: string;
  text: string;
  authorId: string;
}
