import { GraphQLResolveInfo } from "graphql";

import { FunctionalAreas } from "app-models";
import { doesPathExist } from "app-utils";

const functionalAreas = async (_, __, ___, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, ["functionalAreas", element]);
  try {
    let functionalAreas = await FunctionalAreas.get();

    if (shouldJoin("count")) {
      functionalAreas = functionalAreas.map((functionalArea) => {
        // TODO: fix me
        functionalArea.count = 1;
        return functionalArea;
      });
    }

    return functionalAreas;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default functionalAreas;
