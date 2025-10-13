import { Users } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';

const updateFilterPreset = async (_, { updateFilterPresetInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    if (!isPermitted({ user, action: 'users.edit' })) throw new Error('User is not permitted');

    const { _id, name, filters, moduleId, moduleType, pageName, userId, metadata } = updateFilterPresetInput;

    // Find the user to update
    const userToUpdate = await Users.customFindById(userId, organization._id);
    if (!userToUpdate) throw new Error("User doesn't exist");

    // Ensure filtersPreset is an array
    let updatedFiltersPreset = Array.isArray(userToUpdate.filtersPreset) ? [...userToUpdate.filtersPreset] : [];

    // Find the preset to update
    const presetIndex = updatedFiltersPreset.findIndex((preset) => preset._id === _id);
    if (presetIndex === -1) throw new Error("Filter preset doesn't exist");

    // Update the preset
    const updatedMetatags = genMetatags('updated', user.userId);
    updatedFiltersPreset[presetIndex] = {
      ...updatedFiltersPreset[presetIndex],
      name,
      filters,
      moduleId,
      moduleType,
      pageName,
      metadata,
      metatags: {
        ...updatedFiltersPreset[presetIndex].metatags,
        updatedBy: updatedMetatags.updatedBy as string,
        updatedAt: updatedMetatags.updatedAt as Date,
      },
    };

    // Update the user with the updated filter preset
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

    return updatedFiltersPreset[presetIndex];
  } catch (err: any) {
    throw new Error(err.message || 'Failed to update filter preset');
  }
};

export default updateFilterPreset;
