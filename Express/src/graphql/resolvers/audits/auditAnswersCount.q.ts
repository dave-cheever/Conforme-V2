import { Questions } from 'app-models';

const auditAnswersCount = async (_, { auditId }, { organization }) => {
  try {
    const pipeline: any[] = [
      {
        $match: {
          'scope._id': auditId,
          'metatags.removedAt': {
            $eq: null,
          },
          organizationId: organization._id,
        },
      },
      {
        $lookup: {
          from: 'questionsCategories',
          localField: 'questionsCategoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'answers',
        },
      },
    ];

    const questions = await Questions.aggregate(pipeline);

    return questions?.reduce((acc, curr) => acc + (curr?.category?.[0]?.countInAuditCard ? curr?.answers?.length : 0), 0);
  } catch (err: any) {
    throw new Error(err);
  }
};

export default auditAnswersCount;
