import { IScope } from "app-interfaces";

export interface IBase {
  _id: string;
  _doc?: any;
  organizationId: string;
  scope?: IScope;
  metatags: {
    addedBy: string;
    addedAt: Date;
    updatedBy?: string;
    updatedAt?: Date;
    removedBy?: string;
    removedAt?: Date;
  };
}
