import { Model, model, Schema } from 'mongoose';

import { IOrganization, IUser, IUserModel } from 'app-interfaces';
import { GraphService } from 'app-services';
import { Organizations } from 'app-models';

const userSchema = new Schema<IUser, IUserModel>({
  _id: String,
  firstName: String,
  lastName: String,
  displayName: String,
  email: String,
  jobTitle: String,
  role: {
    type: String,
    enum: ['user', 'reader', 'admin'],
    default: 'user',
  },
  imgUrl: String,
  defaultPage: String,
  organizationsIds: [String],
  metatags: {
    addedAt: Date,
    addedBy: String,
    updatedAt: Date,
    updatedBy: String,
    removedAt: Date,
    removedBy: String
  }
});

userSchema.statics.getById = async function (userId: string): Promise<IUser> {
  const user = await this.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user._doc;
}

userSchema.statics.add = async function (userId: string): Promise<IUser> {
  const user = await this.create({ _id: userId, defaultPage: "/", organizationsIds: [] });
  return user;
}

// This method includes user details from MS Graph
userSchema.statics.findByIdWithDetails = async function ({ userId, organization }: { userId: string, organization: IOrganization }): Promise<IUser> {
  const user: IUser = await this.getById(userId);
  const userDetails = await GraphService.getUserData({ userId, organization });
  const { givenName, surname, displayName, mail, jobTitle } = userDetails;

  let role = 'user';
  const isSystemAdmin = await GraphService.checkMemberGroup({
    userId,
    groupId: organization.adminsGroupId,
    organization,
  });
  if (isSystemAdmin) {
    role = 'systemAdmin';
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
    email: mail!,
    jobTitle: jobTitle!,
    role,
    // image,
  };
}

const userModel = model<IUser, IUserModel>('User', userSchema);
export default userModel;
