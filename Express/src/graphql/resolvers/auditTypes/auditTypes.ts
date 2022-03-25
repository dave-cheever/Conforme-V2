import { AuditTypes } from "app-models";

const auditTypes = async (_, __, { organization }) => {
  try {
    let auditTypes = await AuditTypes.customFind({}, organization._id);
    return auditTypes.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditTypes;
