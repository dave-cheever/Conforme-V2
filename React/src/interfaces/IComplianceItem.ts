import { IBase } from "./IBase";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { IQuestion, IQuestionValue } from "./IQuestion";
import { ILocation } from "./ILocation";

export interface IComplianceItem extends IBase {
  name: string;
  description: string;
  categoryId: string;
  regulatoryBodyId: string;
  dueDate: Date;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  questions?: IQuestion<IQuestionValue>[];
  locationsIds?: string[];
  published: boolean;
  reference?: string;
  
  locations?: ILocation[];
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
}
