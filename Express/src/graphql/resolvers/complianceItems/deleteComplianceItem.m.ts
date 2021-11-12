import { Categories, ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const deleteComplianceItem = async (_, { _id }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "complianceItems.delete", data: { _id } })) {
      throw new Error("User is not permitted");
    }

    const complianceItem = await ComplianceItems.getById(_id);
    if (!complianceItem) {
      throw new Error("Compliance item doesn't exist");
    }
    if (complianceItem.published) {
      throw new Error("Can not delete published compliance item");
    }

    const deletedComplianceItem = {
      ...complianceItem,
      metatags: {
        ...complianceItem?.metatags,
        ...genMetatags("removed", user._id),
      },
    };
    await ComplianceItems.updateOne({ _id: complianceItem._id }, deletedComplianceItem);

    return true;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default deleteComplianceItem;
