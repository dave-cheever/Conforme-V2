import { Control, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

import { IAudit } from './IAudit';
import { IAuditType } from './IAuditType';
import { IBusinessUnit } from './IBusinessUnit';
import { ILocation } from './ILocation';
import { IUser } from './IUser';

export interface IAuditModalContext {
  control: Control<IAudit>;
  defaultValues: Partial<IAudit>;
  errors: { [fieldName: string]: object };
  setValue: UseFormSetValue<Partial<IAudit>>;
  trigger: UseFormTrigger<IAudit>;
  reset: (values?: Record<string, any>, options?: Record<string, boolean>) => void;
  resetField: (name: string, options?: Record<string, boolean | any>) => void;

  audit: Partial<IAudit>;
  refetch: () => void;

  auditTypes: Partial<IAuditType>[];
  businessUnits: Partial<IBusinessUnit>[];
  locations: Partial<ILocation>[];
  users: Partial<IUser>[];
}
