import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const updateComplianceItem = async (_, { complianceItemModifyInput }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({
      user,
      action: "complianceItems.edit",
      data: complianceItemModifyInput,
    })) {
      throw new Error("User is not permitted");
    }

    const complianceItemInstance = await ComplianceItems.findById(complianceItemModifyInput._id);
    if (!complianceItemInstance?._doc) {
      return false;
    }
    const { _doc: complianceItem } = complianceItemInstance;
    if (!complianceItem) {
      throw new Error("Compliance item doesn't exist");
    }

    const updatedComplianceItem = {
      ...complianceItem,
      ...complianceItemModifyInput,
      metatags: {
        ...complianceItem.metatags,
        ...genMetatags("updated", user._id),
      },
    };

    complianceItemInstance.overwrite(updatedComplianceItem);
    complianceItemInstance.save();

    // @ts-ignore
    complianceItemInstance.customSynchronizeResponses({
      userId: user._id,
      prevDueDate: complianceItem.dueDate,
    });

    return updatedComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateComplianceItem;
