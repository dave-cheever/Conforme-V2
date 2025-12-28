import { IBase } from "./IBase";
import { IUser } from "./IUser";

export interface IActionTemplate extends IBase {
  title: string;
  description: string;
  actionCategoryId: string;

  // Additional fields - can be added in the API
  suggestedOwner?: IUser;
}