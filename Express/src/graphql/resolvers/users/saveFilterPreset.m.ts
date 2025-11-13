import { Users } from 'app-models';
import { genMetatags } from 'app-utils';
import { v4 as uuidv4 } from 'uuid';

const saveFilterPreset = async (_, { saveFilterPresetInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { name, filters, moduleId, moduleType, pageName, userId, metadata } = saveFilterPresetInput;
    
    if (user.userId !== userId) throw new Error('User is not permitted');

    // Find the user to update
    const userToUpdate = await Users.customFindById(userId, organization._id);
    if (!userToUpdate) throw new Error("User doesn't exist");

    // Ensure filtersPreset is an array
    let updatedFiltersPreset = Array.isArray(userToUpdate.filtersPreset) ? [...userToUpdate.filtersPreset] : [];

    // Create new filter preset
    const metatags = genMetatags('added', user.userId);
    const newFilterPreset = {
      _id: uuidv4(),
      name,
      filters,
      moduleId,
      moduleType,
      pageName,
      userId,
      metadata,
      metatags: {
        addedBy: metatags.addedBy as string,
        addedAt: metatags.addedAt as Date,
        updatedBy: metatags.updatedBy as string | undefined,
        updatedAt: metatags.updatedAt as Date | undefined,
        removedBy: metatags.removedBy as string | undefined,
        removedAt: metatags.removedAt as Date | undefined,
      },
    };

    // Add the new preset to the array
    updatedFiltersPreset.push(newFilterPreset);

    // Update the user with the new filter preset
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

    return newFilterPreset;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to save filter preset');
  }
};

export default saveFilterPreset;
