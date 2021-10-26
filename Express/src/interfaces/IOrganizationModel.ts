import { Model } from "mongoose";

import { IOrganization } from "app-interfaces";

export interface IOrganizationModel extends Model<IOrganization> {
  getById: (_id: string) => Promise<IOrganization>;
  getByDomain: (domain: string) => Promise<IOrganization>;
};
