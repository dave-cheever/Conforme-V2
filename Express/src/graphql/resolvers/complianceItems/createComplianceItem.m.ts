import { v4 as uuidv4 } from "uuid";

import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createComplianceItem = async (_, { complianceItemInput }, { authorize, organization }) => {
  try {
    const user = await authorize();

    if (!isPermitted({ user, action: "complianceItems.add" })) {
      throw new Error("User is not permitted");
    }
    
    const reference = await ComplianceItems.customGenerateReference();
    const newComplianceItem = {
      _id: uuidv4(),
      ...complianceItemInput,
      reference,
      organizationId:organization._id,
      metatags: genMetatags("added", user._id),
    };

    const complianceItem = await ComplianceItems.create(newComplianceItem);

    // @ts-ignore
    complianceItem.customSynchronizeResponses({
      userId: user._id,
      organization
    });

    return newComplianceItem;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default createComplianceItem;
