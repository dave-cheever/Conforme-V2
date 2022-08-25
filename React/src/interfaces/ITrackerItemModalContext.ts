import { Dispatch, SetStateAction } from 'react';
import { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

import { ITrackerItemModalSection } from '../contexts/TrackerItemModalProvider';
import { IBaseWithName } from './IBaseWithName';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { ITrackerItem } from './ITrackerItem';
import { ITrackerItemModalDialogDetails } from './ITrackerItemModalDialogDetails';

export interface ITrackerItemModalContext {
  control: Control<ITrackerItem>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<Partial<ITrackerItem>>;
  trigger: UseFormTrigger<ITrackerItem>;
  reset: (trackerItem?: Partial<ITrackerItem>, setSection?: number) => void;

  trackerItem: Partial<ITrackerItem>;
  refetch: () => void;

  visitedTab: number;
  setVisitedTab: (visitedTab: number) => void;

  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  locations: Partial<ILocation>[];

  savingDialogDetails: ITrackerItemModalDialogDetails;
  setSavingDialogDetails: Dispatch<SetStateAction<ITrackerItemModalDialogDetails>>;

  trackerItemModalSections: ITrackerItemModalSection[];
  selectedSection: ITrackerItemModalSection;
  selectedSectionIndex: number;
  selectSection: (sectionIndex: number) => void;
}
