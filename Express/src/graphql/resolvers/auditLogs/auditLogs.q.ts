import { PipelineStage } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { AuditLogs } from 'app-models';

const auditLogs = async (_, { auditLogsQuery }, { organization }) => {
  try {
    const { skip, limit, actions, dateLimit, elementId, userId, fields, moduleId } =
      auditLogsQuery;

    const pipeline: PipelineStage[] = [
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
      const parsedDate = new Date(dateLimit);
      if (!isNaN(parsedDate.getTime())) {
        pipeline.push({
          $match: {
            'metatags.addedAt': { $lte: parsedDate },
          },
        });
      }
    }

    if (actions?.length > 0) {
      pipeline.push({
        $match: {
          action: { $in: actions },
        },
      });
    }

    if (fields?.length > 0) {
      pipeline.push({
        $match: {
          $or: fields.map((field) => ({ [`values.${field}`]: { $exists: true } })),
        },
      });
    }

    if (elementId) {
      pipeline.push({
        $match: { 'element._id': elementId },
      });
    }

    if (userId) {
      pipeline.push({
        $match: { 'metatags.addedBy': userId },
      });
    }

    if (moduleId) {
      pipeline.push({
        $match: { moduleId },
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

    // Fix: Remove $match from find() and structure correctly
    const totalAuditLogs = await AuditLogs.countDocuments({
      organizationId: organization._id,
      ...(elementId && { 'element._id': elementId }),
      ...(userId && { 'metatags.addedBy': userId }),
      ...(moduleId && { moduleId }),
      ...(actions?.length > 0 && { action: { $in: actions } }),
      ...(fields?.length > 0 && {
        $or: fields.map((field) => ({ [`values.${field}`]: { $exists: true } })),
      }),
      ...(dateLimit && !isNaN(new Date(dateLimit).getTime()) && {
        'metatags.addedAt': { $lte: new Date(dateLimit) },
      }),
    });

    const auditLogs = await AuditLogs.aggregate(pipeline);

    return {
      _id: uuidv4(),
      totalAuditLogs,
      auditLogs,
    };
  } catch (err: any) {
    throw new Error(err.message || 'Error fetching audit logs');
  }
};

export default auditLogs;
