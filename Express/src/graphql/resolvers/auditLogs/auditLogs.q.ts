import { AuditLogs } from 'app-models';
import { v4 as uuidv4 } from 'uuid';


const auditLogs = async (_, { auditLogsQuery }, { organization }) => {
  try {
    const { skip, limit, actions, dateLimit, elementId, userId, fields, moduleId } =
      auditLogsQuery;

    const pipeline: any = [
      {
        $match: {
          organizationId: organization._id,
        },
      },
      {
        $sort: {
          'metatags.addedAt': -1,
        },
      },
    ];

    if (dateLimit) {
      pipeline.push({
        $match: {
          'metatags.addedAt': {
            $lte: new Date(dateLimit),
          },
        },
      });
    }

    if (actions?.length > 0) {
      pipeline.push({
        $match: {
          $or: actions.map(action => ({ action })),
        },
      });
    }

    if (fields?.length > 0) {
      const fieldsPipeline: object[] = [];
      fields.forEach((field) => {
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
          'element._id': elementId,
        },
      });
    }

    if (userId) {
      pipeline.push({
        $match: {
          'metatags.addedBy': userId,
        },
      });
    }

    if (moduleId) {
      pipeline.push({
        $match: {
          'moduleId': moduleId,
        },
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
            format: '%Y-%m-%d',
            date: '$metatags.addedAt',
          },
        },
      },
    });

    pipeline.push({
      $group: {
        _id: '$date',
        records: {
          $push: {
            _id: '$_id',
            action: '$action',
            coll: '$coll',
            element: '$element',
            values: '$values',
            metatags: '$metatags',
          },
        },
      },
    });

    const [auditLogs, totalAuditLogs] = await Promise.all([
      AuditLogs.aggregate(pipeline),
      AuditLogs.find({
        organizationId: organization._id,
        ...(elementId && { 'element._id': elementId }),
        ...(userId && { 'metatags.addedBy': userId }),
        ...(moduleId && { 'moduleId': moduleId }),
        ...(actions?.length > 0 && { $or: actions.map(action => ({ action })) }),
        ...(dateLimit && {
          $match: {
            'metatags.addedAt': {
              $lte: new Date(dateLimit),
            },
          }
        }),
      }).count()
    ]);
    return {
      _id: uuidv4(),
      totalAuditLogs,
      auditLogs
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditLogs;
