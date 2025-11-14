import { Users } from 'app-models';
import { isPermitted } from 'app-utils';

const getFilterPresets = async (_, { getFilterPresetsInput }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { userId, moduleId, pageName } = getFilterPresetsInput;
    if (user.userId !== userId) throw new Error('User is not permitted');

    // Find the user
    const userData = await Users.customFindById(userId, organization._id);
    if (!userData) throw new Error("User doesn't exist");

    // Get filter presets
    let filterPresets = Array.isArray(userData.filtersPreset) ? userData.filtersPreset : [];

    // Filter by moduleId if provided
    if (moduleId) {
      filterPresets = filterPresets.filter((preset) => preset.moduleId === moduleId);
    }

    // Filter by pageName if provided
    if (pageName) {
      filterPresets = filterPresets.filter((preset) => preset.pageName === pageName);
    }

    // Filter out removed presets
    filterPresets = filterPresets.filter((preset) => !preset.metatags?.removedAt);

    return filterPresets;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to get filter presets');
  }
};

export default getFilterPresets;
