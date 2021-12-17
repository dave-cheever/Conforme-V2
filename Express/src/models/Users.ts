import { model, Schema } from 'mongoose';

import { IOrganization, IUser, IUserModel } from 'app-interfaces';
import { GraphService } from 'app-services';
import { getProtocol } from 'app-utils';

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
    "organizationsIds": { $in: [organization._id] },
    "metatags.removedAt": { $eq: null },
  }).lean();
  return users;
};

userSchema.statics.customFindById = async function (userId: string): Promise<IUser> {
  const user = await this.findById(userId).lean();
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}


userSchema.statics.customCreate = async function (user: IUser, userId: string, organization: IOrganization): Promise<IUser> {
  const newUser = await this.create({
    ...user,
    defaultPage: "/",
    organizationsIds: [organization._id],
    userCreated: Date.now(),
  });
  return newUser;
}

// This method includes user details from MS Graph
userSchema.statics.customFindByIdWithDetails = async function ({ userId, organization }: { userId: string, organization: IOrganization }): Promise<IUser> {
  const user = await this.customFindById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  const userDetails = await GraphService.getUserData({ userId, organization });
  const { givenName, surname, displayName, mail, userPrincipalName, jobTitle } = userDetails;

  let role = 'user';
  const isAdmin = await GraphService.checkMemberGroup({
    userId,
    groupId: organization.adminsGroupId,
    organization,
  });
  if (isAdmin) {
    role = 'admin';
  } else {
    const isReader = await GraphService.checkMemberGroup({
      userId,
      groupId: organization.readersGroupId,
      organization,
    });
    if (isReader) {
      role = 'reader';
    }
  }

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
}

const userModel = model<IUser, IUserModel>('User', userSchema);
export default userModel;
