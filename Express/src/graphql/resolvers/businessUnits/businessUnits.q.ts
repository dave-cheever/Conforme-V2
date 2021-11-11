import { GraphQLResolveInfo } from "graphql";

import { BusinessUnits } from "app-models";
import { doesPathExist } from "app-utils";

const businessUnits = async (_, __, ___, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ["businessUnits", element]);
  try {
    let businessUnits = await BusinessUnits.get();

    if (shouldJoin("responsesCount")) {
      businessUnits = businessUnits.map((businessUnit) => {
        // TODO: fix me
        businessUnit.responsesCount = 1;
        return businessUnit;
      });
    }

    return businessUnits;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default businessUnits;
