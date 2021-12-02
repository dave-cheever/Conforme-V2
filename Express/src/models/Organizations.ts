import { model, Schema } from 'mongoose';

import { IOrganization, IOrganizationModel } from 'app-interfaces';

const organizationSchema = new Schema<IOrganization, IOrganizationModel>({
  _id: String,
  name: String,
  domain: String,
  licenceExpirationDate: Date,
  logoUrl: String,
  bgImageUrl: String,
  theme: Object,
  addons: Object,
  allowedTenantsIds: [String],
  accessGroupId: String,
  readersGroupId: String,
  adminsGroupId: String,
  spSiteUrl: String,
  spLibraryId: String,
  emailAddress: String,
  emailPassword: String,
  tenantId: String,
  clientId: String,
  secret: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

organizationSchema.statics.getById = async function (_id: string): Promise<IOrganization> {
  const organization = await this.findById(_id);
  if (!organization) {
    throw new Error('Organization not found');
  }
  return organization._doc;
}

organizationSchema.statics.getByDomain = async function (domain: string): Promise<IOrganization> {
  const organization = await this.findOne({ domain });
  if (!organization) {
    throw new Error('Organization not found');
  }
  return organization._doc;
}

const organizationModel = model<IOrganization, IOrganizationModel>('Organization', organizationSchema);
export default organizationModel;
