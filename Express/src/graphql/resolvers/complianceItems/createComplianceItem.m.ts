import { v4 as uuidv4 } from "uuid";

import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createComplianceItem = async (_, { complianceItemInput }, { authorize }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "complianceItems.add" })) {
      throw new Error("User is not permitted");
    }

    const newComplianceItem = {
      _id: uuidv4(),
      ...complianceItemInput,
      metatags: genMetatags("added", user._id),
    };

    const complianceItem = await ComplianceItems.create(newComplianceItem);

    // @ts-ignore
    complianceItem.syncResponses({
      userId: user._id,
    });

    return newComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createComplianceItem;
