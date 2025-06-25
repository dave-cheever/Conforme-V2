import {
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { response } from 'express';
import { GraphQLResolveInfo } from 'graphql';
import { PipelineStage } from 'mongoose';

import { Responses } from 'app-models';
import { doesPathExist, getProjectFields, isPermitted, join } from 'app-utils';
import { ITrackerQuestion, TQuestionValue } from 'app-interfaces';
import { capitalize, flatten, uniqBy } from 'lodash';

const customQuestionsOptions = async (_, { filterName }, { authorize, organization }, info: GraphQLResolveInfo) => {
  try {
    const user = await authorize();
    const pipeline: PipelineStage[] = [
      {
        $match: {
          organizationId: organization._id,
        },
      },
    ];

    if (!isPermitted({ user, action: 'responses.viewAll' })) {
      pipeline.push({
        $match: {
          $or: [
            { accountableId: user.userId },
            { responsibleId: user.userId },
            { contributorsIds: { $in: [user.userId] } },
            { followersIds: { $in: [user.userId] } },
          ],
        },
      });
    }

    pipeline.push(...[
      {
        $unwind: "$questions",
      },
      {
        $match: {
          "questions.name": filterName,
        }
      },
      {
        $project: {
          type: "$questions.type",
          value: "$questions.value",
        },
      },
    ]);

    const res = (await Responses.aggregate(pipeline));

    const getQuestionOptions = (question: ITrackerQuestion<TQuestionValue>): { label: string; value: string; }[] => {
      const options: { label: string; value: string; }[] = [];
      switch (question.type) {
        case "text":
        case "textMultiline":
        case "url":
          if (question.value) options.push({ label: question.value as string, value: question.value as string });
          break;

        case "switch":
          if (question.value) options.push({ label: capitalize(question.value as string), value: question.value as string });
          break;

        case "datepicker":
          if (question.value && isValid(question.value)) options.push({ label: format(new Date(question.value as string), "d MMM yyyy"), value: question.value as string });
          break;

        case "singleChoice": {
          if (question.value) options.push(...(question.options || []));
          break;
        }

        case 'multipleChoice': {
          const answers = (question.value as { label: string; }[]).map(({ label }) => ({ label, value: label }));
          options.push(...answers);
          break;
        }
      }
      return options;
    };

    return uniqBy(flatten(res.map(question => getQuestionOptions(question))), "label");
  } catch (err: any) {
    throw new Error(err);
  }
};

export default customQuestionsOptions;
