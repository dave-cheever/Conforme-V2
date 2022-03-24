import { IBase } from "./IBase";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { ITrackerQuestion } from "./ITrackerQuestion";
import { ILocation } from "./ILocation";
import { TQuestionValue } from "./TQuestionValue";

export interface IComplianceItem extends IBase {
  name: string;
  description: string;
  categoryId: string;
  regulatoryBodyId: string;
  dueDate: Date;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  questions?: ITrackerQuestion<TQuestionValue>[];
  locationsIds?: string[];
  published: boolean;
  reference?: string;
  
  locations?: ILocation[];
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
}
