import { GraphQLResolveInfo } from 'graphql';

import { RegulatoryBodies } from "app-models";
import { doesPathExist } from 'app-utils';

const regulatoryBodies = async (_, __, ___, info: GraphQLResolveInfo) => {
  const shouldJoin = (element: string) => doesPathExist(info.fieldNodes, [
    'regulatoryBodies',
    element,
  ]);
  try {
    let regulatoryBodies = await RegulatoryBodies.get();
    
    if (shouldJoin('count')) {
      regulatoryBodies = regulatoryBodies.map(regulatoryBody => {
        // TODO: fix me
        regulatoryBody.count = 1;
        return regulatoryBody;
      });
    }

    return regulatoryBodies;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default regulatoryBodies;
