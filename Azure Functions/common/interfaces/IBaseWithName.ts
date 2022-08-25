import { IBase } from "./IBase";

export interface IBaseWithName extends IBase {
  name: string;
  trackerItemsResponsesCount?: number;
}
