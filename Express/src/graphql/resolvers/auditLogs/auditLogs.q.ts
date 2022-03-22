
import { AuditLogs } from "app-models";

const auditLogs = async (_, { auditLogsQuery }, { organization }) => {
  try {
    const { skip, limit, action, dateLimit, elementId, userId, fields } = auditLogsQuery;

    const pipeline: any = [{
      $match: {
        organizationId: organization._id,
      },
    }, {
      $sort: {
        'metatags.addedAt': -1,
      },
    }];

    if (dateLimit) {
      pipeline.push({
        $match: {
          'metatags.addedAt': {
            $lte: new Date(dateLimit),
          },
        },
      });
    }

    if (action) {
      pipeline.push({
        $match: { action },
      });
    }

    if (fields?.length > 0) {
      const fieldsPipeline: object[] = [];
      fields.forEach(field => {
        fieldsPipeline.push({
          [`values.${field}`]: {
            $exists: true,
          },
        });
      });
      pipeline.push({
        $match: {
          $or: fieldsPipeline,
        },
      });
    }

    if (elementId) {
      pipeline.push({
        $match: {
          "element._id": elementId,
        }
      });
    }

    if (userId) {
      pipeline.push({
        $match: {
          "metatags.addedBy": userId,
        }
      });
    }

    if (skip) {
      pipeline.push({
        $skip: skip,
      });
    }

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
        }
      },
    });

    const auditLogs = await AuditLogs.aggregate(pipeline);
    return auditLogs;
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditLogs;
