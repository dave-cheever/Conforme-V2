import { RegulatoryBodies } from 'app-models';
import { isPermitted } from 'app-utils';

const deleteRegulatoryBody = async (
  _,
  { _id },
  { authorize, organization },
) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: 'regulatoryBodies.delete', data: { _id } })
    )
      throw new Error('User is not permitted');

    const regulatoryBody = await RegulatoryBodies.customFindById(
      _id,
      organization._id,
    );
    if (!regulatoryBody) throw new Error("Regulatory body doesn't exist");

    const deletedResult = await RegulatoryBodies.customDelete(
      { _id },
      user._id,
      organization._id,
    );
    return deletedResult;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteRegulatoryBody;
