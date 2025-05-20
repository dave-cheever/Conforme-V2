import { IHelp } from "./IHelp";

export interface IHelpModel {
  customFind: (selector?: any) => Promise<IHelp[]>;
  customFindOne: (selector: any) => Promise<IHelp | null>;
}
