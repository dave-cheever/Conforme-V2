import { IBase, IBaseWithName, IBusinessUnit, ILocation, IQuestion } from "app-interfaces";
import { IQuestionValue } from "./IQuestion";

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
  questions?: IQuestion<IQuestionValue>[];

  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
  locations?: ILocation[];

}
