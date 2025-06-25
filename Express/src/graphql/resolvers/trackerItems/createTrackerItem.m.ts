import { TrackerItems } from 'app-models';
import { isPermitted } from 'app-utils';

const createTrackerItem = async (
  _,
  { trackerItemInput },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: 'trackerItems.add' }))
      throw new Error('User is not permitted');

    const reference = await TrackerItems.customGenerateReference();
    const newTrackerItem = {
      ...trackerItemInput,
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

export default createTrackerItem;
