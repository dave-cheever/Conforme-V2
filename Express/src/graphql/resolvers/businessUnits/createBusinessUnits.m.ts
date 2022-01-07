import { v4 as uuidv4 } from "uuid";

import { BusinessUnits } from "app-models";
import { genMetatags, isPermitted } from "app-utils";

const createBusinessUnit = async (_, {businessUnitInput}, { authorize, organization }) => {
    try {
      const user = await authorize();
  
      if (!isPermitted({ user, action: "businessUnits.add" })) {
        throw new Error("User is not permitted");
      }
  
      const newBusinessUnit = {
        _id: uuidv4(),
        ...businessUnitInput,
        organizationId: organization._id,
        metatags: genMetatags("added", user._id),
      };
      await BusinessUnits.create(newBusinessUnit)
  
      return newBusinessUnit;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  
  export default createBusinessUnit;
  