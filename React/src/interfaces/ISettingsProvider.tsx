import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { ISetting } from "./ISettings";

import { IComplianceItem } from "./IComplianceItem";

export interface ISettingsContext {
  control: Control<ISetting>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<ISetting>;
  trigger: UseFormTrigger<ISetting>;

  loading: boolean;
  settings: Partial<ISetting>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];

  activeTab: 0 | 1 | 2;
  setActiveTab: Dispatch<SetStateAction<0 | 1 | 2>>;
}
