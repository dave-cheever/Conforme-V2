import { TrackerItems } from 'app-models';
import { genMetatags, isPermitted } from 'app-utils';

const deleteTrackerItem = async (
  _,
  { _id },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: 'trackerItems.delete', data: { _id } })
    )
      throw new Error('User is not permitted');

    const trackerItem = await TrackerItems.customFindById(
      _id,
      organization._id,
    );
    if (!trackerItem)
      throw new Error("Tracker item doesn't exist");

    if (trackerItem.published)
      throw new Error('Can not delete published tracker item');

    const deletedTrackerItem = {
      ...trackerItem,
      metatags: {
        ...trackerItem?.metatags,
        ...genMetatags('removed', user.userId),
      },
    };
    await TrackerItems.updateOne(
      { _id: trackerItem._id },
      deletedTrackerItem,
    );

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteTrackerItem;
