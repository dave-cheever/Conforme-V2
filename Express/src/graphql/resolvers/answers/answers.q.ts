import {
  addMonths,
  compareDesc,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { GraphQLResolveInfo } from 'graphql';

import { Answers, Users } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';

const answers = async (_, { answerQuery }, { authorize, organization }, info: GraphQLResolveInfo) => {
  const shouldJoin = (elements: string[]) => doesPathExist(info.fieldNodes, ['answers', ...elements]);
  try {
    const user = await authorize();
    const pipeline: any[] = [
      {
        $match: {
          'metatags.removedAt': { $eq: null },
          organizationId: organization._id,
        },
      },
    ];

    if (answerQuery?._id) {
      pipeline.push({
        $match: {
          _id: answerQuery._id,
        },
      });
    }

    if (answerQuery?.status?.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: answerQuery.status,
          },
        },
      });
    }

    if (answerQuery?.createdDate) {
      const [filter, startDate, endDate] = answerQuery?.createdDate;
      let $match;
      switch (filter) {
        case 'thisWeek':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfWeek(new Date(), { weekStartsOn: 1 }),
                },
              },
            ],
          };
          break;
        case 'thisMonth':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfMonth(new Date()),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfMonth(new Date()),
                },
              },
            ],
          };
          break;
        case 'thisYear':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfYear(new Date()),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfYear(new Date()),
                },
              },
            ],
          };
          break;
        case 'nextMonth':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfMonth(addMonths(new Date(), 1)),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfMonth(addMonths(new Date(), 1)),
                },
              },
            ],
          };
          break;
        case 'exactDate':
          $match = {
            $and: [
              {
                'metatags.addedAt': {
                  $gte: startOfDay(new Date(startDate)),
                },
              },
              {
                'metatags.addedAt': {
                  $lte: endOfDay(new Date(startDate)),
                },
              },
            ],
          };
          break;
        case 'dateRange':
          if (startDate && endDate) {
            $match = {
              $and: [
                {
                  'metatags.addedAt': {
                    $gte: startOfDay(new Date(startDate)),
                  },
                },
                {
                  'metatags.addedAt': {
                    $lte: endOfDay(new Date(endDate)),
                  },
                },
              ],
            };
          }
          break;
        default:
          break;
      }

      if ($match) pipeline.push({ $match });
    }

    if (shouldJoin(['question']) || answerQuery?.questionsCategoriesIds?.length > 0) {
      join({
        pipeline,
        collection: 'questions',
        from: 'questionId',
        to: 'question',
      });

      if (answerQuery?.questionsCategoriesIds?.length > 0) {
        pipeline.push({
          $match: {
            'question.questionsCategoryId': {
              $in: answerQuery.questionsCategoriesIds,
            },
          },
        });
      }
    }

    if (shouldJoin(['question', 'questionsCategory'])) {
      join({
        pipeline,
        collection: 'questionsCategories',
        from: 'question.questionsCategoryId',
        to: 'question.questionsCategory',
      });
    }

    if (shouldJoin(['actions'])) {
      pipeline.push({
        $lookup: {
          from: 'actions',
          localField: '_id',
          foreignField: 'scope._id',
          as: 'actions',
        },
      });
    }

    if (shouldJoin(['audit']) || !isPermitted({ user, action: 'answers.viewAll' })) {
      join({
        pipeline,
        collection: 'audits',
        from: 'scope._id',
        to: 'audit',
      });
    }

    // For "user" role filter answers
    if (!isPermitted({ user, action: 'answers.viewAll' })) {
      // If user doesn't have permissions to get all answers
      // need to check if he is an area or site owner
      join({
        pipeline,
        collection: 'locations',
        from: 'audit.siteId',
        to: 'audit.site',
      });
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'audit.areaId',
        to: 'audit.area',
      });

      /**
       * User's direct reports. The user is a manager of these users.
       */
      const users = await Users.customFindWithDetails({ selector: { managerId: user._id }, organization });

      /**
       * Array of all users including the user himself and his direct reports
       */
      const userIds = [user._id, ...users.map((user) => user._id)];

      const $or: { [key: string]: string }[] = [];
      userIds.forEach((_id) => {
        $or.push(
          ...[
            {
              'audit.auditorId': _id,
            },
            {
              'audit.participantsIds': _id,
            },
            {
              'audit.site.ownerId': _id,
            },
            {
              'audit.area.ownerId': _id,
            },
          ],
        );
      });

      pipeline.push({
        $match: {
          $or,
        },
      });
    }

    if (shouldJoin(['audit', 'site'])) {
      join({
        pipeline,
        collection: 'locations',
        from: 'audit.siteId',
        to: 'audit.site',
      });
    }

    if (shouldJoin(['audit', 'area'])) {
      join({
        pipeline,
        collection: 'businessUnits',
        from: 'audit.areaId',
        to: 'audit.area',
      });
    }

    if (answerQuery?.sitesIds?.length > 0) {
      pipeline.push({
        $match: {
          'audit.siteId': { $in: answerQuery.sitesIds },
        },
      });
    }

    if (answerQuery?.areasIds?.length > 0) {
      pipeline.push({
        $match: {
          'audit.areaId': { $in: answerQuery.areasIds },
        },
      });
    }

    pipeline.push({ $project: getProjectFields(info.fieldNodes, 'answers') });

    let answers = await Answers.aggregate(pipeline);

    answers = answers.map((answer) => ({ ...answer, actions: answer.actions.filter((action) => !action?.metatags?.removedAt) }));

    if (shouldJoin(['addedBy'])) {
      answers = await Promise.all(
        answers.map(async (answer) => {
          try {
            return {
              ...answer,
              addedBy: await Users.customFindByIdWithDetails({
                userId: answer?.metatags?.addedBy,
                organization,
              }),
            };
          } catch (e) {
            console.log(`Error occured for answer with ID ${answer._id}: ${e}`);
            return answer;
          }
        }),
      );
    }

    if (answerQuery?.usersIds?.addedByIds?.length > 0)
      answers = answers.filter((answer) => answerQuery.usersIds.addedByIds.includes(answer.addedBy._id));

    return answers.sort((a, b) => compareDesc(new Date(a?.metatags?.addedAt), new Date(b?.metatags?.addedAt)));
  } catch (err: any) {
    throw new Error(err);
  }
};

export default answers;
