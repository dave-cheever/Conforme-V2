import { response } from 'express';

import { AuditLogs, Responses } from 'app-models';
import { isPermitted, join } from 'app-utils';

const search = async (_, { searchQuery }, { authorize, organization }) => {
  try {
    const user = await authorize();
    const { searchText } = searchQuery;
    const pipeline: any[] = [
      {
        $match: {
          organizationId: organization._id,
        },
      },
    ];

    if (
      !isPermitted({ user, action: 'responses.viewAll', data: { response } })
    ) {
      pipeline.push({
        $match: {
          $or: [
            { accountableId: user._id },
            { responsibleId: user._id },
            { contributorsIds: { $in: [user._id] } },
            { followersIds: { $in: [user._id] } },
          ],
        },
      });
    }

    // Filter by published state
    if (
      !(
        searchQuery?.includeNotPublished &&
        isPermitted({ user, action: 'responses.viewAll' })
      )
    ) {
      pipeline.push({
        $match: {
          published: true,
        },
      });
    }

    // Join compliance item
    join({
      pipeline,
      collection: 'complianceItems',
      from: 'complianceItemId',
      to: 'complianceItem',
    });

    // Filter by search text (in compliance item)
    pipeline.push({
      $match: {
        'complianceItem.name': new RegExp(searchText, 'i'),
      },
    });

    pipeline.push({
      $limit: 5,
    });

    // Join business unit
    join({
      pipeline,
      collection: 'businessUnits',
      from: 'businessUnitId',
      to: 'businessUnit',
    });

    pipeline.push({
      $project: {
        _id: 1,
        primaryText: '$complianceItem.name',
        secondaryText: '$businessUnit.name',
        type: 'compliance-item',
      },
    });

    const responses = await Responses.aggregate(pipeline);

    AuditLogs.customAudit(
      {
        coll: 'responses',
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
    );

    return responses;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default search;
