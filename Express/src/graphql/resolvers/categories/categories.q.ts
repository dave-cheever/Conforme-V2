import { GraphQLResolveInfo } from "graphql";

import { Categories } from "app-models";
import { doesPathExist } from "app-utils";

const categories = async (_, __, ___, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ["categories", element]);
  try {
    let categories = await Categories.get();

    if (shouldJoin("count")) {
      categories = categories.map((category) => {
        // TODO: fix me
        category.count = 1;
        return category;
      });
    }

    return categories;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default categories;
