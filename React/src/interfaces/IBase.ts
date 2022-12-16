import { IScope } from "./IScope";

export interface IBase {
  _id: string;
  organizationId: string;
  scope?: IScope;
  metatags?: {
    addedBy?: string;
    addedAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}
