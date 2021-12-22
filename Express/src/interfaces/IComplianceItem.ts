import { IBase, IBaseWithName, IBusinessUnit, IQuestion } from "app-interfaces";

export interface IComplianceItem extends IBase {
  name: string;
  description: string;
  categoryId: string;
  regulatoryBodyId: string;
  dueDate?: Date;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  questions?: IQuestion[];
  published: boolean;
  reference: string;
  organizationId: string;
  
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
}
