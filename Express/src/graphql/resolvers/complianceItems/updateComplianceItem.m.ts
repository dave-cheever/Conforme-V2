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

    const complianceItemDocument = await ComplianceItems.findById(complianceItemModifyInput._id);
    if (!complianceItemDocument?._doc) {
      return false;
    }
    const { _doc: complianceItem } = complianceItemDocument;
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

    complianceItemDocument.overwrite(updatedComplianceItem);
    complianceItemDocument.save();

    // @ts-ignore
    complianceItemDocument.customSynchronizeResponses({
      userId: user._id,
      prevDueDate: complianceItem.dueDate,
      organization
    });

    return updatedComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateComplianceItem;
