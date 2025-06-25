import { IQuestionChoice } from 'app-interfaces';
import {
  Responses,
  TrackerItems,
} from 'app-models';
import { getNextRenewalDate, isPermitted } from 'app-utils';

const submitResponse = async (_, { _id }, { authorize, organization }) => {
  try {
    const user = await authorize();

    const response = await Responses.customFindById(_id, organization._id);
    if (!response)
      throw new Error("Response doesn't exist");

    if (!isPermitted({ user, action: 'responses.edit', data: { response } }))
      throw new Error('User is not permitted');

    const trackerItem = await TrackerItems.customFindById(
      response.trackerItemId,
      organization._id,
    );
    if (!trackerItem) throw new Error("Tracker item assigned to response doesn't exist");

    // If questions or evidence has changed, set right status
    const areRequiredQuestionsAnswered = response.questions
      .filter(({ required }) => required)
      .every(({ value, type, requiredAnswer }) => {
        if (type === 'multipleChoice') (value as IQuestionChoice[]).some(({ label, isCorrect }) => requiredAnswer?.includes(label) && isCorrect)
        if (type === 'singleChoice') return value === requiredAnswer;
        return value || (typeof value === 'boolean' && value === false);
      });
    const isEvidenceUploaded = response.evidence
      .every(({ uploaded }) => uploaded && uploaded.id);
    if (!areRequiredQuestionsAnswered || !isEvidenceUploaded) return false;

    let dueDate: Date | null = null;
    if (response.dueDate && trackerItem.dueDateCalculation === 'fromDueDate') dueDate = getNextRenewalDate(response.dueDate, trackerItem.frequency);
    else dueDate = getNextRenewalDate(new Date(), trackerItem.frequency);

    await Responses.customUpdateOne(
      { _id },
      {
        status: 'submitted',
        lastCompletionDate: new Date(),
        dueDate,
      },
      user.userId,
      organization._id,
    );
    return dueDate;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default submitResponse;
