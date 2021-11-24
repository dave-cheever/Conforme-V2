import { IBase } from "./IBase";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { IQuestion } from "./IQuestion";

export interface IComplianceItem extends IBase {
  name: string;
  description: string;
  categoryId: string;
  regulatoryBodyId: string;
  functionalAreaId: string;
  dueDate: Date;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  retentionPeriod: number;
  questions?: IQuestion[];
  published: boolean;
  reference?: string;
  
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  functionalArea?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
}
