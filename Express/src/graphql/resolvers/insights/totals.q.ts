import { GraphQLResolveInfo } from "graphql";

import { BusinessUnits, Locations, Responses, Users } from "app-models";
import { doesPathExist } from "app-utils";

const totals = async (_, __, { organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['totals', ...elements]);
  const totals: { [type: string]: number } = {};

  if (shouldJoin(['users'])) {
    totals.users = await Users.count({
      'metatags.removedAt': null,
      organizationsIds: organization._id,
    });
  }

  if (shouldJoin(['locations'])) {
    totals.locations = await Locations.count({
      'metatags.removedAt': null,
      organizationId: organization._id,
    });
  }

  if (shouldJoin(['businessUnits'])) {
    totals.businessUnits = await BusinessUnits.count({
      'metatags.removedAt': null,
      organizationId: organization._id,
    });
  }

  if (shouldJoin(['trackerResponses'])) {
    totals.trackerResponses = await Responses.count({
      'metatags.removedAt': null,
      organizationsIds: organization._id,
    });
  }

  return totals;
};

export default totals;
