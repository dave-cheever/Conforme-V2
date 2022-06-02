import { IBase } from "./IBase";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { ILocation } from "./ILocation";
import { ITrackerQuestion } from "./ITrackerQuesion";
import { TQuestionValue } from "./TQuestionValue";

export interface IComplianceItem extends IBase {
  name: string;
  description: string;
  categoryId: string;
  regulatoryBodyId: string;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  locationsIds: string[];
  published: boolean;
  reference: string;
  organizationId: string;
  dueDate?: Date;
  questions?: ITrackerQuestion<TQuestionValue>[];

  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
  locations?: ILocation[];
}
