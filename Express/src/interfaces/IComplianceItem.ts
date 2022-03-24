import {
  IBase,
  IBaseWithName,
  IBusinessUnit,
  ILocation,
  IQuestionValue,
  ITrackerQuestion,
} from "app-interfaces";

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
  questions?: ITrackerQuestion<IQuestionValue>[];

  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
  locations?: ILocation[];

}
