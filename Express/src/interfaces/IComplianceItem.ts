import {
  IBase,
  IBaseWithName,
  IBusinessUnit,
  ILocation,
  ITrackerQuestion,
  TQuestionValue,
} from 'app-interfaces';

export interface IComplianceItem extends IBase {
  name: string;
  description?: string;
  categoryId: string;
  regulatoryBodyId: string;
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  allowAttachments?: boolean;
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
