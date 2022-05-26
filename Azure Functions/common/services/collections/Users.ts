import { model, Schema } from 'mongoose';
import { IOrganization } from '../../interfaces/IOrganization';
import { IUser } from '../../interfaces/IUser';
import { IUserModel } from '../../interfaces/IUserModel';
import { getProtocol } from '../../utils';
import { GraphService } from '../GraphService';

const userSchema = new Schema<IUser, IUserModel>({
  _id: String,
  defaultPage: String,
  organizationsIds: [String],
  userCreated: Date,
  lastLogin: Date,
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

userSchema.statics.customFind = async function ({ organization }): Promise<IUser[]> {
  const users = await this.find({
    organizationsIds: { $in: [organization._id] },
    'metatags.removedAt': { $eq: null }
  }).lean();
  return users;
};

userSchema.statics.customFindById = async function (userId: string): Promise<IUser | null> {
  const user = await this.findById(userId).lean();
  return user;
};

// This method includes user details from MS Graph
userSchema.statics.customFindByIdWithDetails = async function ({
  userId,
  organization
}: {
  userId: string;
  organization: IOrganization;
}): Promise<IUser> {
  const user = await this.customFindById(userId, organization._id);
  if (!user) throw new Error('User not found');

  const userDetails = await GraphService.getUserData({ userId, organization });
  const { givenName, surname, displayName, mail, userPrincipalName, jobTitle } = userDetails;

  let role = 'user';
  const roles: any = await GraphService.checkMemberGroups({
    userId,
    groups: {
      admin: organization.adminsGroupId || '',
      reader: organization.readersGroupId || ''
    },
    organization
  });

  if (roles.admin) role = 'admin';
  else if (roles.reader) role = 'reader';

  return {
    ...user,
    firstName: givenName!,
    lastName: surname!,
    displayName: displayName!,
    email: mail || userPrincipalName!,
    jobTitle: jobTitle!,
    role,
    imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${user._id}`
  };
};

const userModel = model<IUser, IUserModel>('User', userSchema);
export default userModel;
