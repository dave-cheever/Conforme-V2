import { IBase } from './IBase';
import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { ITrackerQuestion } from './ITrackerQuestion';
import { TQuestionValue } from './TQuestionValue';

export interface IComplianceItem extends IBase {
  name: string;
  description?: string;
  categoryId: string;
  regulatoryBodyId: string;
  dueDate: Date;
  dueDateCalculation: 'fromDueDate' | 'fromCompletionDate';
  frequency: string;
  businessUnitsIds: string[];
  evidenceItems: string[];
  allowAttachments?: boolean;
  questions?: ITrackerQuestion<TQuestionValue>[];
  locationsIds?: string[];
  published: boolean;
  reference?: string;

  locations?: ILocation[];
  category?: IBaseWithName;
  regulatoryBody?: IBaseWithName;
  businessUnits?: IBusinessUnit[];
}
