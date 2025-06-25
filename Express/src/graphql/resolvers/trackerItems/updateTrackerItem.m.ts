import { TrackerItems } from 'app-models';
import { isPermitted } from 'app-utils';

const updateTrackerItem = async (
  _,
  { trackerItemModifyInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({
        user,
        action: 'trackerItems.edit',
        data: trackerItemModifyInput,
      })
    )
      throw new Error('User is not permitted');

    const trackerItem = await TrackerItems.customFindById(
      trackerItemModifyInput._id,
      organization._id,
    );
    if (!trackerItem) throw new Error("Tracker item doesn't exist");

    const updatedTrackerItem = await TrackerItems.customUpdateOne(
      { _id: trackerItem._id },
      trackerItemModifyInput,
      user.userId,
      organization._id,
    );

    TrackerItems.customSynchronizeResponses({
      trackerItem: updatedTrackerItem,
      userId: user.userId,
      prevDueDate: trackerItem.dueDate,
      organizationId: organization._id,
    });

    return updatedTrackerItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateTrackerItem;
