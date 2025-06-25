import { Settings } from 'app-models';
import { isPermitted } from 'app-utils';

const updateSetting = async (
  _,
  { settingsUpdate },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: 'settings.edit', data: settingsUpdate }) ||
      !organization
    )
      throw new Error('User is not permitted');

    const setting = await Settings.customFindById(
      settingsUpdate._id,
      organization._id,
    );

    if (!setting) throw new Error("Settings doesn't exist");

    const updatedSetting = await Settings.customUpdateOne(
      { _id: setting._id },
      settingsUpdate,
      user.userId,
      organization._id,
    );
    return updatedSetting;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateSetting;
