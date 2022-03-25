import { AuditTypes } from "app-models";
import { isPermitted } from "app-utils";

const updateAuditType = async (_, { auditTypeInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (
      !isPermitted({ user, action: "auditTypes.edit", data: auditTypeInput })
    ) {
      throw new Error("User is not permitted");
    }

    const auditType = await AuditTypes.customFindById(auditTypeInput._id, organization._id);
    if (!auditType) {
      throw new Error("Audit type doesn't exist");
    }

    const updatedAuditType = await AuditTypes.customUpdateOne({ _id: auditType._id }, auditTypeInput, user._id, organization._id);
    return updatedAuditType;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default updateAuditType;
