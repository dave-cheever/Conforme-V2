import { GraphQLResolveInfo } from 'graphql';

import { AuditLogs, Audits, Responses } from 'app-models';
import { doesPathExist } from 'app-utils';

const search = async (
  _,
  { searchQuery },
  { authorize, organization },
  info: GraphQLResolveInfo,
) => {
  const shouldJoin = (elements: string[]) =>
    doesPathExist(info.fieldNodes, ['search', ...elements]);
  try {
    const user = await authorize();
    const { searchText, moduleId } = searchQuery;
    const data: any = {
      audits: [],
      responses: [],
    };

    if (shouldJoin(['audits'])) {
      data.audits = await Audits.customSearch(
        searchQuery,
        user,
        organization._id,
      );
    }

    if (shouldJoin(['responses'])) {
      data.responses = await Responses.customSearch(
        searchQuery,
        user,
        organization._id,
      );
    }

    await Promise.all(
      info.fieldNodes.map(async (fieldNode) => {
        AuditLogs.customAudit(
          {
            coll: fieldNode.name.value,
            action: 'search',
            element: {
              _id: 'null',
              name: 'search',
            },
            values: {
              searchText: {
                new: {
                  value: searchText,
                  label: searchText,
                },
              },
            },
          },
          user._id,
          organization._id,
          moduleId,
        );
      }),
    );

    return data;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default search;
