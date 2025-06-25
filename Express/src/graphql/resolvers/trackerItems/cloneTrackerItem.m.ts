import { TrackerItems } from 'app-models';
import { isPermitted } from 'app-utils';

const cloneTrackerItem = async (
  _,
  { _id: clonedId },
  { authorize, organization },
) => {
  try {
    const user = await authorize();
    if (
      !isPermitted({
        user,
        action: 'trackerItems.clone',
        data: { clonedId },
      })
    )
      throw new Error('User is not permitted');

    const trackerItem = await TrackerItems.customFindById(
      clonedId,
      organization._id,
    );
    if (!trackerItem) throw new Error("Tracker item doesn't exist");

    const reference = await TrackerItems.customGenerateReference();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, name, published, ...trackerItemInputs } = trackerItem;
    const newTrackerItem = {
      name: `Copy of - ${trackerItem.name}`,
      ...trackerItemInputs,
      published: false,
      reference,
    };

    const createdTrackerItem = await TrackerItems.customCreate(
      newTrackerItem,
      user.userId,
      organization._id,
    );

    TrackerItems.customSynchronizeResponses({
      trackerItem: createdTrackerItem,
      userId: user.userId,
      organizationId: organization._id,
    });

    return createdTrackerItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default cloneTrackerItem;
