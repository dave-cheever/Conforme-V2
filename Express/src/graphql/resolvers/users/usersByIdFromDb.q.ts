import { Users } from 'app-models';

const usersByIdFromDb = async (_, { userQueryInput }, { organization }) => {
  try {
    const { usersIds } = userQueryInput;
    if (!usersIds || usersIds.length === 0) return [];
    // Fetch users from MongoDB by their IDs and organization
    const users = await Users.find({
      userId: { $in: usersIds },
      organizationsIds: { $in: [organization._id] },
      'metatags.removedAt': { $eq: null },
    }).lean();
    return users;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : String(err));
  }
};

export default usersByIdFromDb;
