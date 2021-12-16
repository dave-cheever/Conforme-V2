import { ComplianceItems } from "app-models";
import { genMetatags, isPermitted } from "app-utils";
import { v4 as uuidv4 } from "uuid";

const cloneComplianceItem = async (_, { complianceId }, { authorize }) => {
  try {
    const user = await authorize();
    if (!isPermitted({ user, action: "complianceItems.clone", data: { complianceId } })) {
      throw new Error("User is not permitted");
    }

    const complianceItem = await ComplianceItems.customFindById(complianceId);
    if (!complianceItem) {
      throw new Error("Compliance item doesn't exist");
    }
    
    const reference = await ComplianceItems.customGenerateReference();
    const { _id, name, published, ...complianceItemInputs } = complianceItem;
    const newComplianceItem = {
      _id: uuidv4(),
      name: "Copy of - " + complianceItem.name,
      ...complianceItemInputs,
      published: false,
      reference,
      metatags: genMetatags("added", user._id),
    };
  
    const complianceItemReturn = await ComplianceItems.create(newComplianceItem);
  
    // @ts-ignore
    complianceItemReturn.syncResponses({
     userId: user._id,
    });

    return newComplianceItem;
  } catch (err: any) {
    throw new Error(err);
    
  }
};

export default cloneComplianceItem;

