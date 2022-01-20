import { Responses } from "app-models";
import { isPermitted } from "app-utils";

const updateResponse = async (_, { updateResponseModify }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { _id, nextRenewalDate } = updateResponseModify;

    const response = await Responses.findOne({ _id, organizationId: organization._id });
    if (!response) {
      throw new Error("Response doesn't exist");
    }

    if (!isPermitted({ user, action: 'responses.edit', data: { response } })) {
      throw new Error('User is not permitted');
    }

    const updatedResponse = await Responses.customUpdateOne({ _id }, { nextRenewalDate: nextRenewalDate === null ? null : new Date(nextRenewalDate) }, user._id, organization._id);

    return updatedResponse;
  } catch (error: any) {
    throw new Error(error);
  }
}

export default updateResponse;
