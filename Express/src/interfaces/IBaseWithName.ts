import { IBase } from "app-interfaces";

export interface IBaseWithName extends IBase {
  name: string;
  count?: number;
};
