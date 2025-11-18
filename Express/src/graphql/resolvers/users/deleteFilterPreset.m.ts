import { Users } from 'app-models';
import { genMetatags } from 'app-utils';

const deleteFilterPreset = async (_, { deleteFilterPresetInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, userId } = deleteFilterPresetInput;

    // Ensure the userId being modified is the same as the userId of the session user
    if (user.userId !== userId) {
      throw new Error('User is not permitted');
    }

    // Find the user to update
    const userToUpdate = await Users.customFindById(userId, organization._id);
    if (!userToUpdate) throw new Error("User doesn't exist");

    // Ensure filtersPreset is an array
    let updatedFiltersPreset = Array.isArray(userToUpdate.filtersPreset) ? [...userToUpdate.filtersPreset] : [];

    // Find the preset to delete
    const presetIndex = updatedFiltersPreset.findIndex((preset) => preset._id === _id);
    if (presetIndex === -1) throw new Error("Filter preset doesn't exist");

    // Remove the preset from the array
    updatedFiltersPreset.splice(presetIndex, 1);

    // Update the user with the updated filter preset array
    const updatedUser = {
      ...userToUpdate._doc,
      filtersPreset: updatedFiltersPreset,
      metatags: {
        ...userToUpdate?.metatags,
        ...genMetatags('updated', user.userId),
      },
    };

    // Update the user in the database
    await Users.updateOne({ userId: userToUpdate.userId }, updatedUser);

    return { success: true, message: 'Filter preset deleted successfully' };
  } catch (err: any) {
    throw new Error(err.message || 'Failed to delete filter preset');
  }
};

export default deleteFilterPreset;
