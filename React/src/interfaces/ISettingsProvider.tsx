import { Dispatch, SetStateAction } from "react";
import { Control, UseFormSetValue, UseFormTrigger } from "react-hook-form";
import { IBaseWithName } from "./IBaseWithName";
import { IBusinessUnit } from "./IBusinessUnit";
import { ISetting }  from "./ISetting";

export interface ISettingsContext {
  control: Control<ISetting>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<ISetting>;
  trigger: UseFormTrigger<ISetting>;

  loading: boolean;
  defaultSettings : Partial<ISetting>[];
  notificationSettings : Partial<ISetting>[];
  categories: Partial<IBaseWithName>[];
  regulatoryBodies: Partial<IBaseWithName>[];
  businessUnits: Partial<IBusinessUnit>[];
  
  reset: (setting?: Partial<ISetting>) => void;
  refetch: () => void;

  formValues: any;
  activeTab: number;
  setActiveTab: Dispatch<SetStateAction<number>>;
}
