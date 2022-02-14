import { GraphQLResolveInfo } from "graphql";

import { Categories, Responses } from "app-models";
import { doesPathExist, join } from "app-utils";

const categories = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) =>
    doesPathExist(info.fieldNodes, ["categories", element]);
  try {
    let categories = await Categories.customFind({}, organization._id);

    if (shouldJoin("complianceItemsResponsesCount")) {
      for (const category of categories) {
        let pipeline: any[] = [];
        join({
          pipeline,
          collection: 'complianceItems',
          from: 'complianceItemId',
          to: 'complianceItem',
        });
        pipeline.push({
          $match: {
            'complianceItem.categoryId': category._id,
            published: true,
          },
        });
        pipeline.push({
          $count: 'count',
        });
        const responses = await Responses.aggregate(pipeline);
        if (responses && responses.length > 0) {
          category.complianceItemsResponsesCount = responses[0].count;
        }
      }
    }

    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default categories;
