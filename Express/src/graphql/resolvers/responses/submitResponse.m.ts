import { IQuestionChoice } from 'app-interfaces';
import {
  ComplianceItems,
  Responses,
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

    const complianceItem = await ComplianceItems.customFindById(
      response.complianceItemId,
      organization._id,
    );
    if (!complianceItem)
      throw new Error("Compliance item assigned to response doesn't exist");

    // If questions or evidence has changed, set right status
    const areRequiredQuestionsAnswered = response.questions
      .filter(({ required }) => required)
      .every(({ value, type }) => {
        if (type === 'multipleChoice') {
          return (value as IQuestionChoice[]).some(
            (choice) => choice.isCorrect === true,
          );
        }
        return value || (typeof value === 'boolean' && value === false);
      });
    const isEvidenceUploaded = response.evidence
      .every(({ uploaded }) => uploaded && uploaded.id);
    if (!areRequiredQuestionsAnswered || !isEvidenceUploaded) return false;

    let dueDate: Date | null = null;
    if (response.dueDate) {
      if (complianceItem.dueDateCalculation === 'fromDueDate') dueDate = getNextRenewalDate(response.dueDate, complianceItem.frequency);
      else dueDate = getNextRenewalDate(new Date(), complianceItem.frequency);
    }

    await Responses.customUpdateOne(
      { _id },
      {
        status: 'submitted',
        lastCompletionDate: new Date(),
        dueDate,
      },
      user._id,
      organization._id,
    );
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};

export default submitResponse;
