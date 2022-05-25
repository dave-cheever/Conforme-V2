import { isBefore, subMinutes } from 'date-fns';
import { model, Schema } from 'mongoose';

import { IOrganization, IUser, IUserModel } from 'app-interfaces';
import { Users } from 'app-models';
import { GraphService } from 'app-services';
import { genMetatags, getProtocol } from 'app-utils';

const userSchema = new Schema<IUser, IUserModel>({
  _id: String,
  firstName: String,
  lastName: String,
  displayName: String,
  email: String,
  jobTitle: String,
  role: String,
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
    removedBy: String,
  },
});

// Creating custom methods for every collection to manipulate th DB because we want to do some checks

userSchema.statics.customFind = async function ({ organization }): Promise<IUser[]> {
  const users = await this.find({
    organizationsIds: { $in: [organization._id] },
    'metatags.removedAt': { $eq: null },
  }).lean();
  return users;
};

userSchema.statics.customFindById = async function (userId: string): Promise<IUser | null> {
  const user = await this.findById(userId).lean();
  return user;
};

userSchema.statics.customAdd = async function (user: IUser, userId: string, organizationId: string): Promise<IUser> {
  const newUser = await this.create({
    ...user,
    defaultPage: '/',
    organizationsIds: [organizationId],
    userCreated: Date.now(),
  });
  return newUser;
};

// This method includes user details from MS Graph
userSchema.statics.customFindByIdWithDetails = async function ({
  userId,
  organization,
}: {
  userId: string;
  organization: IOrganization;
}): Promise<IUser> {
  let user = await this.customFindById(userId, organization._id);
  if (!user) throw new Error('User not found');

  // Refresh user data if it wasn't refreshed in the last 5 minutes
  if (isBefore(new Date(user.metatags?.updatedAt || 0), subMinutes(new Date(), 5))) {
    const userDetails = await GraphService.getUserData({ userId, organization });

    let role = 'user';
    const roles: any = await GraphService.checkMemberGroups({
      userId,
      groups: {
        admin: organization.adminsGroupId || '',
        reader: organization.readersGroupId || '',
      },
      organization,
    });

    if (roles.admin) role = 'admin';
    else if (roles.reader) role = 'reader';

    user = {
      ...user,
      firstName: userDetails?.givenName || '',
      lastName: userDetails?.surname || '',
      displayName: userDetails?.displayName || '',
      email: userDetails?.mail || userDetails?.userPrincipalName || '',
      jobTitle: userDetails?.jobTitle || '',
      role,
      metatags: {
        ...user.metatags,
        ...genMetatags('updated', user._id),
      },
    };
    await Users.updateOne({ _id: user._id }, user);
  }

  return {
    ...user,
    imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${user._id}`,
  };
};

const userModel = model<IUser, IUserModel>('User', userSchema);
export default userModel;
