import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateComplianceItem = async (_, { complianceItemModifyInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({
      user,
      action: "complianceItems.edit",
      data: complianceItemModifyInput,
    })) {
      throw new Error("User is not permitted");
    }

    const complianceItem = await ComplianceItems.customFindById(complianceItemModifyInput._id, organization._id);
    if (!complianceItem) {
      throw new Error("Compliance item doesn't exist");
    }

    const updatedComplianceItem = await ComplianceItems.customUpdateOne({ _id: complianceItem._id }, complianceItemModifyInput, user._id, organization._id);

    ComplianceItems.customSynchronizeResponses({
      complianceItem: updatedComplianceItem,
      userId: user._id,
      prevDueDate: complianceItem.dueDate,
      organizationId: organization._id,
    });

    return updatedComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateComplianceItem;
