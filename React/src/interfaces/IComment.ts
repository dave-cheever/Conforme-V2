import { IBase } from "./IBase";
import { IUser } from "./IUser";

export interface IComment extends IBase {
  responseId: string;
  text: string;
  author?: IUser;
}
