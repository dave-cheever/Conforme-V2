import { model, Schema } from 'mongoose';

import { IOrganization, IOrganizationModel } from 'app-interfaces';

const organizationSchema = new Schema<IOrganization, IOrganizationModel>({
  _id: String,
  name: String,
  domain: String,
  licenceExpirationDate: Date,
  logoUrl: String,
  logoUrlMobile: String,
  bgImageUrl: String,
  bgImageTabletUrl: String,
  theme: Object,
  modules: [
    {
      _id: String,
      type: {
        type: String,
        enum: ['audits', 'tracker'],
      },
      name: String,
      path: String,
      icon: String,
      showInNavigation: Boolean,
      translations: Object,
      customQuestionsInDashboard: [String],
    },
  ],
  revokedPermissions: [String],
  allowedTenantsIds: [String],
  accessGroupId: String,
  readersGroupId: String,
  adminsGroupId: String,
  spSiteUrl: String,
  spLibraryId: String,
  emailAddress: String,
  tenantId: String,
  clientId: String,
  secret: String,
  loginText: String,
  loginTextMobile: String,
  logoutText: String,
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String,
  },
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

organizationSchema.statics.customFindById = async function (_id: string): Promise<IOrganization> {
  const organization = await this.findById(_id).lean();
  if (!organization) throw new Error('Organization not found');

  return organization;
};

organizationSchema.statics.customFindByDomain = async function (domain: string): Promise<IOrganization> {
  const organization = await this.findOne({ domain }).lean();
  if (!organization) throw new Error('Organization not found');

  return organization;
};

const organizationModel = model<IOrganization, IOrganizationModel>('Organization', organizationSchema);
export default organizationModel;
