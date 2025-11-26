import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subYears,
} from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { IUser } from 'app-interfaces';
import { Audits, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const buildDateRangeMatch = (filter: string, startDate: string, endDate: string, filterByCreatedDate: boolean) => {
  const dateField = filterByCreatedDate ? 'metatags.addedAt' : 'dueDate';
  const now = new Date();

  const dateRanges: Record<string, { $gte: Date; $lte: Date }> = {
    thisWeek: {
      $gte: startOfWeek(now, { weekStartsOn: 1 }),
      $lte: endOfWeek(now, { weekStartsOn: 1 }),
    },
    thisMonth: {
      $gte: startOfMonth(now),
      $lte: endOfMonth(now),
    },
    thisYear: {
      $gte: startOfYear(now),
      $lte: endOfYear(now),
    },
    last12Months: {
      $gte: startOfMonth(addMonths(subYears(now, 1), 1)),
      $lte: endOfMonth(now),
    },
    nextMonth: {
      $gte: startOfMonth(addMonths(now, 1)),
      $lte: endOfMonth(addMonths(now, 1)),
    },
    exactDate: {
      $gte: startOfDay(new Date(startDate)),
      $lte: endOfDay(new Date(startDate)),
    },
    dateRange: {
      $gte: startOfDay(new Date(startDate)),
      $lte: endOfDay(new Date(endDate)),
    },
  };

  const range = dateRanges[filter];
  if (!range) return null;

  if (filter === 'dateRange' && (!startDate || !endDate)) return null;

  return {
    $and: [
      { [dateField]: { $gte: range.$gte } },
      { [dateField]: { $lte: range.$lte } },
    ],
  };
};

const buildInitialMatches = (auditQueryInput: any, organization: any): PipelineStage[] => {
  const matches: PipelineStage[] = [
    {
      $match: {
        'metatags.removedAt': auditQueryInput?.showArchived ? { $exists: true } : { $eq: null },
        organizationId: organization._id,
      },
    },
  ];

  if (auditQueryInput?._id) {
    matches.push({ $match: { _id: auditQueryInput._id } });
  }

  return matches;
};

const buildFilterMatches = (auditQueryInput: any): PipelineStage[] => {
  const matches: PipelineStage[] = [];

  if (auditQueryInput?.walkType?.length > 0) {
    matches.push({ $match: { walkType: { $in: auditQueryInput.walkType } } });
  }

  if (auditQueryInput?.auditTypesIds?.length > 0) {
    matches.push({ $match: { auditTypeId: { $in: auditQueryInput.auditTypesIds } } });
  }

  if (auditQueryInput?.locationsIds?.length > 0) {
    matches.push({ $match: { locationId: { $in: auditQueryInput.locationsIds } } });
  }

  if (auditQueryInput?.businessUnitsIds?.length > 0) {
    matches.push(
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'answers',
        },
      },
      {
        $match: {
          $or: [
            { businessUnitId: { $in: auditQueryInput.businessUnitsIds } },
            { 'answers.businessUnitId': { $in: auditQueryInput.businessUnitsIds } },
          ],
        },
      },
    );
  }

  if (auditQueryInput?.usersIds?.auditorsIds?.length > 0) {
    matches.push({ $match: { auditorId: { $in: auditQueryInput.usersIds.auditorsIds } } });
  }

  if (auditQueryInput?.usersIds?.participantsIds?.length > 0) {
    matches.push({ $match: { participantsIds: { $in: auditQueryInput.usersIds.participantsIds } } });
  }

  if (auditQueryInput?.status?.length > 0) {
    matches.push({ $match: { status: { $in: auditQueryInput.status } } });
  }

  return matches;
};

const buildDateFilterMatch = (auditQueryInput: any): PipelineStage | null => {
  if (!auditQueryInput?.createdDate && !auditQueryInput?.dueDate) return null;

  const [filter, startDate, endDate] = auditQueryInput?.createdDate || auditQueryInput?.dueDate;
  const filterByCreatedDate = !!auditQueryInput.createdDate;
  const dateMatch = buildDateRangeMatch(filter, startDate, endDate, filterByCreatedDate);

  return dateMatch ? { $match: dateMatch } : null;
};

const buildUserPermissionMatch = async (user: any, organization: any): Promise<PipelineStage | null> => {
  if (isPermitted({ user, action: 'audits.viewAll' })) return null;

  const users = await Users.customFindWithDetails({ selector: { managerId: user.userId }, organization });
  const userIds = [user.userId, ...users.map((u) => u.userId)];

  const $or = userIds.flatMap((_id) => [
    { auditorId: _id },
    { participantsIds: _id },
    { 'location.ownerId': _id },
    { 'businessUnit.ownerId': _id },
  ]);

  return { $match: { $or } };
};

const buildLookupStages = (
  shouldJoin: (elements: string[]) => boolean,
  baseProjection: any,
): { stages: PipelineStage[]; projection: any } => {
  const stages: PipelineStage[] = [];
  const projection = { ...baseProjection };

  if (shouldJoin(['questions'])) {
    stages.push({
      $lookup: {
        from: 'questions',
        localField: '_id',
        foreignField: 'scope._id',
        as: 'questions',
      },
    });
    projection.questions = 1;
  }

  if (shouldJoin(['numberOfActions'])) {
    stages.push(
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'answers',
        },
      },
      {
        $lookup: {
          from: 'actions',
          localField: 'answers._id',
          foreignField: 'scope._id',
          as: 'actions',
        },
      },
      {
        $project: {
          ...projection,
          actions: 1,
          answers: 1,
        },
      },
    );
  }

  if (shouldJoin(['answersCount'])) {
    stages.push(
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'questions',
        },
      },
      {
        $lookup: {
          from: 'answers',
          localField: 'questions._id',
          foreignField: 'questionId',
          as: 'answers',
        },
      },
      {
        $project: {
          ...projection,
          answers: 1,
        },
      },
    );
  }

  return { stages, projection };
};

const buildPaginationStages = (pagination: any): PipelineStage[] => {
  const sortBy = pagination?.sortBy || 'metatags.addedAt';
  const sortDirection = pagination?.sortDirection === 'asc' ? 1 : -1;
  const limit = pagination?.limit || 15;
  const offset = pagination?.offset || 0;

  return [
    {
      $facet: {
        audits: [{ $sort: { [sortBy]: sortDirection } }, { $skip: offset }, { $limit: limit }],
        total: [{ $count: 'total' }],
      },
    },
    {
      $unwind: {
        path: '$total',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        audits: 1,
        total: '$total.total',
      },
    },
  ];
};

const enrichAuditsWithUsers = async (
  audits: any[],
  shouldJoin: (elements: string[]) => boolean,
  organization: any,
): Promise<any[]> => {
  if (!shouldJoin(['auditor']) && !shouldJoin(['participants'])) return audits;

  const userIdsSet = new Set<string>();
  audits.forEach((audit) => {
    if (shouldJoin(['auditor']) && audit.auditorId) {
      userIdsSet.add(audit.auditorId);
    }
    if (shouldJoin(['participants']) && audit.participantsIds?.length > 0) {
      audit.participantsIds.forEach((id: string) => userIdsSet.add(id));
    }
  });

  const userIdsArray = Array.from(userIdsSet);
  const usersMap = new Map<string, IUser>();
  if (userIdsArray.length > 0) {
    const users = await Users.customFindWithDetails({ selector: { userId: { $in: userIdsArray } }, organization });
    users.forEach((user) => {
      usersMap.set(user.userId, user);
    });
  }

  return audits.map((audit) => {
    const auditor = shouldJoin(['auditor']) && audit.auditorId ? usersMap.get(audit.auditorId) : undefined;
    const participants =
      shouldJoin(['participants']) && audit.participantsIds?.length > 0
        ? audit.participantsIds
          .map((id: string) => usersMap.get(id))
          .filter((user): user is IUser => user !== undefined)
        : [];

    return { ...audit, auditor, participants };
  });
};

const enrichAuditsWithComputedFields = (audits: any[], shouldJoin: (elements: string[]) => boolean): any[] => {
  let result = audits;

  if (shouldJoin(['numberOfActions'])) {
    result = result.map((audit) => ({
      ...audit,
      numberOfActions: audit.actions?.filter((action: any) => !action.metatags.removedAt)?.length ?? 0,
    }));
  }

  if (shouldJoin(['answersCount'])) {
    result = result.map((audit) => ({
      ...audit,
      answersCount: audit.answers?.length || 0,
    }));
  }

  return result;
};

const audits = async (_, { auditQueryInput, pagination }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['audits', 'audits', ...elements]);

  try {
    const user = await authorize();

    const auditsProjectFields = getProjectFields(info.fieldNodes, 'audits') as any;
    const projectFields = auditsProjectFields?.audits || {};
    const baseProjection: any = { ...projectFields };

    const pipelineStages: PipelineStage[] = [];

    pipelineStages.push(...buildInitialMatches(auditQueryInput, organization));

    if (shouldJoin(['location']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline: pipelineStages,
        collection: 'locations',
        from: 'locationId',
        to: 'location',
      });
      baseProjection.locationId = 1;
      baseProjection.location = 1;
    }

    if (shouldJoin(['businessUnit']) || !isPermitted({ user, action: 'audits.viewAll' })) {
      join({
        pipeline: pipelineStages,
        collection: 'businessUnits',
        from: 'businessUnitId',
        to: 'businessUnit',
      });
      baseProjection.businessUnitId = 1;
      baseProjection.businessUnit = 1;
    }

    const userMatch = await buildUserPermissionMatch(user, organization);
    if (userMatch) pipelineStages.push(userMatch);

    pipelineStages.push(...buildFilterMatches(auditQueryInput));

    const dateMatch = buildDateFilterMatch(auditQueryInput);
    if (dateMatch) pipelineStages.push(dateMatch);

    if (shouldJoin(['auditType'])) {
      join({
        pipeline: pipelineStages,
        collection: 'auditTypes',
        from: 'auditTypeId',
        to: 'auditType',
      });
    }

    const { stages: lookupStages } = buildLookupStages(shouldJoin, baseProjection);

    pipelineStages.push(
      ...lookupStages,
      ...buildPaginationStages(pagination)
    );

    const res = (await Audits.aggregate(pipelineStages))[0];
    let resultAudits = res?.audits || [];

    resultAudits = await enrichAuditsWithUsers(resultAudits, shouldJoin, organization);

    resultAudits = enrichAuditsWithComputedFields(resultAudits, shouldJoin);

    return {
      audits: resultAudits,
      total: res?.total || 0,
    };
  } catch (err: any) {
    throw new Error(err);
  }
};

export default audits;
