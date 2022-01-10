
import { AuditLogs } from "app-models";

const auditLogs = async (_, { auditLogsQuery }, { organization }) => {
  try {
    const { skip, limit, dateLimit } = auditLogsQuery;

    const pipeline: any = [{
      $match: {
        // organizationId: organization._id,
        'metatags.addedAt': {
          $lte: new Date(dateLimit),
        },
      },
    }, {
      $sort: {
        'metatags.addedAt': -1,
      },
    }, {
      $skip: skip || 0,
    }];

    if (limit) {
      pipeline.push({
        $limit: limit,
      });
    }

    pipeline.push({
      $project: {
        _id: 1,
        action: 1,
        coll: 1,
        element: 1,
        values: 1,
        metatags: 1,
        date: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$metatags.addedAt",
          }
        }
      }
    });

    pipeline.push({
      $group: {
        _id: "$date",
        records: {
          $push: {
            _id: '$_id',
            action: '$action',
            coll: '$coll',
            element: '$element',
            values: '$values',
            metatags: '$metatags',
          }
        },
      },
    });

    const auditLogs = await AuditLogs.aggregate(pipeline);
    return auditLogs;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditLogs;
