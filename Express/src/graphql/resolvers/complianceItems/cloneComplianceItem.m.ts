import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";
import { v4 as uuidv4 } from "uuid";

const cloneComplianceItem = async (_, { _id: clonedId }, { authorize, organization }) => {
  try {
    const user = await authorize();
    if (!isPermitted({ user, action: "complianceItems.clone", data: { clonedId } })) {
      throw new Error("User is not permitted");
    }

    const complianceItem = await ComplianceItems.customFindById(clonedId, organization._id);
    if (!complianceItem) {
      throw new Error("Compliance item doesn't exist");
    }
    
    const reference = await ComplianceItems.customGenerateReference();
    const { _id, name, published, ...complianceItemInputs } = complianceItem;
    const newComplianceItem = {
      name: "Copy of - " + complianceItem.name,
      ...complianceItemInputs,
      published: false,
      reference,
    };
  
    const createdComplianceItem = await ComplianceItems.customCreate(newComplianceItem, user._id, organization._id);

    ComplianceItems.customSynchronizeResponses({
      complianceItem: createdComplianceItem,
      userId: user._id,
      organizationId: organization._id,
    });

    return createdComplianceItem;
  } catch (err: any) {
    throw new Error(err);
    
  }
};

export default cloneComplianceItem;

