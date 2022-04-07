import { IAudit, IBaseModel } from 'app-interfaces';

export interface IAuditModel extends IBaseModel<IAudit> {
  customGenerateReference: () => Promise<string>;
}
