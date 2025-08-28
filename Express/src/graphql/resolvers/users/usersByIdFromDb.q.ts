import { Users } from 'app-models';
import { Types } from 'mongoose';

const usersByIdFromDb = async (_, { userQueryInput }, { organization }) => {
  try {
    const { usersIds } = userQueryInput;
    if (!usersIds || usersIds.length === 0) return [];

    // Remove duplicates and filter empty values
    const uniqueUserIds = [...new Set(usersIds.filter((id: any) => id && typeof id === 'string' && id.trim() !== ''))] as string[];

    if (uniqueUserIds.length === 0) return [];

    // Separate MongoDB ObjectIds from userId strings
    const mongoObjectIds: string[] = [];
    const userIdStrings: string[] = [];

    uniqueUserIds.forEach((id) => {
      if (typeof id === 'string' && Types.ObjectId.isValid(id) && id.length === 24) {
        // This is a MongoDB ObjectId
        mongoObjectIds.push(id);
      } else {
        // This is a userId (UUID/string format) - preferred
        userIdStrings.push(id);
      }
    });

    let users: any[] = [];

    // Priority 1: Search by userId (preferred)
    if (userIdStrings.length > 0) {
      try {
        const usersByUserId = await Users.find({
          userId: { $in: userIdStrings },
          organizationsIds: { $in: [organization._id] },
          'metatags.removedAt': { $eq: null },
        }).lean();

        users.push(...usersByUserId);
      } catch (err) {
        console.error('[usersByIdFromDb] Error searching by userId:', err);
        // Continue with ObjectId search as fallback
      }
    }

    // Priority 2: Search by _id only for IDs that weren't found by userId
    if (mongoObjectIds.length > 0) {
      try {
        const usersByObjectId = await Users.find({
          _id: { $in: mongoObjectIds },
          organizationsIds: { $in: [organization._id] },
          'metatags.removedAt': { $eq: null },
        }).lean();

        users.push(...usersByObjectId);
      } catch (err) {
        console.error('[usersByIdFromDb] Error searching by ObjectId:', err);
      }
    }

    // Remove any potential duplicates (shouldn't happen with the logic above, but safety first)
    const uniqueUsers = users.reduce((acc: any[], user: any) => {
      const existingUser = acc.find((u: any) => u._id.toString() === user._id.toString());
      if (!existingUser) {
        acc.push(user);
      }
      return acc;
    }, []);

    return uniqueUsers;
  } catch (err) {
    console.error('[usersByIdFromDb] Error:', err);
    // Return empty array instead of throwing to prevent 502 errors
    return [];
  }
};

export default usersByIdFromDb;
