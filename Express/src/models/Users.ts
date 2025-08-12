import { isBefore, subHours } from 'date-fns';
import { model, Schema, Types } from 'mongoose';

import { IOrganization, IUser, IUserModel } from 'app-interfaces';
import { Organizations, Users } from 'app-models';
import { GraphService } from 'app-services';
import { genMetatags, getProtocol } from 'app-utils';

const userSchema = new Schema<IUser, IUserModel>({
  _id: Types.ObjectId,
  firstName: String,
  lastName: String,
  displayName: String,
  email: String,
  jobTitle: String,
  role: String,
  managerId: String,
  userId: String,
  defaultPage: {
    type: [{
      name: { type: String },
      path: { type: String }
    }],
    default: [],
    set: (val: any) => {
      if (typeof val === 'string') {
        return [{ name: 'Document Control', path: val }];
      }
      if (val && !Array.isArray(val) && typeof val === 'object') {
        return [val];
      }
      return Array.isArray(val) ? val : [];
    }
  },
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

userSchema.statics.customAdd = async function (user: IUser, organizationId: string): Promise<IUser> {
  const newUser = await this.create({
    ...user,
    defaultPage: [],
    organizationsIds: [organizationId],
    userCreated: Date.now(),
  });
  return newUser;
};

// This method includes user details from MS Graph
userSchema.statics.customFindWithDetails = async function ({
  selector = {},
  pagination = {},
  organization,
  awaitForResponse = false,
  caseInsensitive = false,
}: {
  selector: any;
  pagination?: { limit?: number; offset?: number };
  organization: IOrganization;
  awaitForResponse: boolean;
  caseInsensitive?: boolean;
}): Promise<IUser[]> {
  if (!organization) return [];
  
  // Handle case-insensitive email lookup
  let processedSelector = { ...selector };
  if (caseInsensitive) {
    // Apply case-insensitive matching to all string fields in the selector
    Object.keys(processedSelector).forEach(key => {
      const value = processedSelector[key];
      if (typeof value === 'string') {
        processedSelector[key] = { $regex: new RegExp(`^${value}$`, 'i') };
      }
    });
  }
  
  let usersRequested = this.find({
    ...processedSelector,
    organizationsIds: { $in: [organization._id] as any }, // There is TS issue inside mongoose library with $in type
    'metatags.removedAt': { $eq: null },
  });

  if (pagination?.offset) usersRequested = usersRequested.skip(pagination.offset);

  if (pagination?.limit) usersRequested = usersRequested.limit(pagination.limit);

  let users = await usersRequested.lean();

  // Refresh user data if it wasn't refreshed in the last 6 hours
  const syncedUsersPromises = users.map(async (user) => {
    if (isBefore(new Date(user.metatags?.updatedAt || 0), subHours(new Date(), 6))) {
      const userDetails = await GraphService.getUserData({ userId: user.userId || '', organization });
      const managerId = await GraphService.getLineManagerId({ userId: user.userId || '', organization });

      let role = 'user';
      const roles: any = await GraphService.checkMemberGroups({
        userIdOrEmail: user.userId || '',
        groups: {
          admin: organization.adminsGroupId || '',
          reader: organization.readersGroupId || '',
        },
        organization,
      });

      if (roles.admin) role = 'admin';
      else if (roles.reader) role = 'reader';

      if (userDetails) {
        // Only update fields if userDetails are present and not empty
      const updatedUser = {
          ...user,
          firstName: userDetails.givenName?.trim() ? userDetails.givenName : user.firstName,
          lastName: userDetails.surname?.trim() ? userDetails.surname : user.lastName,
          displayName: userDetails.displayName?.trim() ? userDetails.displayName : user.displayName,
          email: userDetails.mail?.trim() || userDetails.userPrincipalName?.trim()
            ? userDetails.mail || userDetails.userPrincipalName
            : user.email,
          jobTitle: userDetails.jobTitle?.trim() ? userDetails.jobTitle : user.jobTitle,
          role,
          managerId,
          metatags: {
            ...user.metatags,
            ...genMetatags('updated', user.userId),
          },
        };
        const { _id, ...userWithoutId } = updatedUser;
        await Users.updateOne({ _id: user._id }, userWithoutId);
        return updatedUser;
      } else {
        // User not found in Entra ID, do NOT overwrite fields
        return user;
      }
    }
    return user;
  });
  if (awaitForResponse) users = await Promise.all(syncedUsersPromises);

  return users.map((user) => ({ ...user, imgUrl: `${getProtocol()}${process.env.API_URL}/files/photo/${user._id}` }));
};

// This method includes user details from MS Graph
userSchema.statics.customFindByIdWithDetails = async function ({
  userId,
  organization,
  awaitForResponse = false,
}: {
  userId: string;
  organization: IOrganization;
  awaitForResponse: boolean;
}): Promise<IUser> {
  const users = await this.customFindWithDetails({ selector: { userId }, organization, awaitForResponse });
  if (!users || users.length === 0) throw new Error('User not found');
  return users[0];
};

userSchema.statics.customAssertUser = async function ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}): Promise<void> {
  try {
    const organization = await Organizations.customFindById(organizationId);
    const user = await Users.findOne({ userId }).lean();
    if (user) {
      if (!user.organizationsIds?.includes(organization._id))
        await Users.updateOne({ userId: user._id }, { organizationsIds: [...(user.organizationsIds || []), organization._id] });
    } else {
      const userDetails = await GraphService.getUserData({ userId, organization });
      if (!userDetails) {
        console.log(`User with ID ${userId} couldn't be added to db as doesn't exist in AAD`);
        return;
      }

      const managerId = await GraphService.getLineManagerId({ userId, organization });

      let role = 'user';
      const roles: any = await GraphService.checkMemberGroups({
        userIdOrEmail: userId,
        groups: {
          admin: organization.adminsGroupId || '',
          reader: organization.readersGroupId || '',
        },
        organization,
      });

      if (roles.admin) role = 'admin';
      else if (roles.reader) role = 'reader';

      const newUser = {
        _id: new Types.ObjectId(),
        userId,
        firstName: userDetails?.givenName || '',
        lastName: userDetails?.surname || '',
        displayName: userDetails?.displayName || '',
        email: userDetails?.mail || userDetails?.userPrincipalName || '',
        jobTitle: userDetails?.jobTitle || '',
        role,
        managerId,
      };
      try {
        await Users.customAdd(newUser, organization._id);
      } catch (e) {
        console.log("Custom add error:", e)
      }
    }
  } catch (e) {
    console.log(`User with ID ${userId} couldn't be found`);
  }
};

const userModel = model<IUser, IUserModel>('User', userSchema);
export default userModel;
