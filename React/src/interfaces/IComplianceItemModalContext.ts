import { Dispatch, SetStateAction } from "react";
import { Control, FieldError, UseFormReset, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { IComplianceItemModalSection } from "../contexts/ComplianceItemModalProvider";

import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { IComplianceItem, IComplianceItemExtended } from "./IComplianceItem";
import { IComplianceItemModalDialogDetails } from "./IComplianceItemModalDialogDetails";

export interface IComplianceItemModalContext {
  control: Control<IComplianceItem>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<IComplianceItem>;
  trigger: UseFormTrigger<IComplianceItem>;
  reset: (complianceItem?: Partial<IComplianceItem>, setSection?: number) => void;

  complianceItem: Partial<IComplianceItem>;

  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  functionalAreas: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];

  savingDialogDetails: IComplianceItemModalDialogDetails;
  setSavingDialogDetails: Dispatch<SetStateAction<IComplianceItemModalDialogDetails>>;

  selectedSection: IComplianceItemModalSection;
  selectedSectionIndex: number;
  setSelectedSection: Dispatch<SetStateAction<IComplianceItemModalSection>>;
}
