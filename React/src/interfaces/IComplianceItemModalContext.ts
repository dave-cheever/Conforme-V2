import { Dispatch, SetStateAction } from 'react';
import { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

import { IComplianceItemModalSection } from '../contexts/ComplianceItemModalProvider';
import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import { IComplianceItem } from './IComplianceItem';
import { IComplianceItemModalDialogDetails } from './IComplianceItemModalDialogDetails';
import { ILocation } from './ILocation';

export interface IComplianceItemModalContext {
  control: Control<IComplianceItem>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<Partial<IComplianceItem>>;
  trigger: UseFormTrigger<IComplianceItem>;
  reset: (complianceItem?: Partial<IComplianceItem>, setSection?: number) => void;

  complianceItem: Partial<IComplianceItem>;
  refetch: () => void;

  visitedTab: number;
  setVisitedTab: (visitedTab: number) => void;

  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  locations: Partial<ILocation>[];

  savingDialogDetails: IComplianceItemModalDialogDetails;
  setSavingDialogDetails: Dispatch<SetStateAction<IComplianceItemModalDialogDetails>>;

  complianceItemModalSections: IComplianceItemModalSection[];
  selectedSection: IComplianceItemModalSection;
  selectedSectionIndex: number;
  selectSection: (sectionIndex: number) => void;
}
