import { IBaseModel, ILocation } from "app-interfaces";

export interface ILocationModel extends IBaseModel<ILocation> {
  customFind: (selector?: any, organisationId?: string) => Promise<ILocation[]>;
  customFindById: (_id: string) => Promise<ILocation>;
  customFindByOwnerId: (ownerId: string) => Promise<ILocation>;
  customFindByOrganizationId: (organizationId: string) => Promise<ILocation>;
};
