import { differenceInDays, startOfDay } from 'date-fns';
import { t } from 'i18next';
import { capitalize, isInteger } from 'lodash';

import { IQuestionChoice } from '../interfaces/IQuestionChoice';
import { IResponse } from '../interfaces/IResponse';
import { ITrackerQuestion } from '../interfaces/ITrackerQuestion';
import { TQuestionValue } from '../interfaces/TQuestionValue';

export const complianceItemFrequencies = [
  'Daily',
  'Weekly',
  'Monthly',
  'Quarterly',
  '6 months',
  'Annual',
  '2 years',
  '3 years',
  '5 years',
  'Ad-hoc',
];

const useResponseUtils = () => {

  const responseStatuses = {
    completed: 'Completed',
    notStarted: 'Not started',
    inProgress: 'In progress',
    comingUp: 'Coming up',
    overdue: 'Overdue',
    noDueDate: 'No due date',
    all: 'All',
    compliant: capitalize(t('compliant')),
    nonCompliant: capitalize(t('non-compliant')),
  };

  const responseStatusesGroup = {
    nonCompliant: capitalize(t('non-compliant')),
    comingUp: 'Coming up',
    compliant: capitalize(t('compliant')),
  };

  const getRenewalStatusText = (response: IResponse) => {
    // TODO: fix and use
    if (!response) return;

    const renewalStatus: string = response.calculatedStatus;
    const { daysToDueDate } = response;
    switch (renewalStatus) {
      case 'draft':
        switch (true) {
          case daysToDueDate && daysToDueDate < -1:
            return `Due ${daysToDueDate && daysToDueDate * -1} days ago`;
          case daysToDueDate === -1:
            return 'Due yesterday';
          case daysToDueDate === 0:
            return 'Due today';
          case daysToDueDate === 1:
            return 'Due tomorrow';
          case daysToDueDate === null:
            return 'No due date';
          default:
            return `Due in ${daysToDueDate} days`;
        }
      case 'submitted': {
        const daysToNextRenewal =
          differenceInDays(startOfDay(new Date()), startOfDay(response.dueDate ? new Date(response.dueDate) : new Date())) * -1;
        if (isInteger(daysToNextRenewal)) return `Next due in ${daysToNextRenewal} days`;

        return `Completed`;
      }
      case 'comingUp':
        if (daysToDueDate === 0) return `Due today`;

        if (daysToDueDate === 1) return `Due tomorrow`;

        return `Due in ${daysToDueDate} days`;
      case 'overdue':
        if (daysToDueDate === -1) return `Due yesterday`;

        return `Due ${daysToDueDate && daysToDueDate * -1} days ago`;
      default:
        break;
    }
  };

  const isEvidenceUploaded = (response: IResponse) => {
    if (!response) return;

    return response?.evidence?.every(({ uploaded }) => uploaded);
  };

  const areRequiredQuestionsAnswered = (response: IResponse) => {
    if (!response) return;

    return response?.questions
      ?.filter(({ required }) => required)
      .every(({ value, type, requiredAnswer }: ITrackerQuestion<TQuestionValue>) => {
        if (type === 'multipleChoice')
          return (value as IQuestionChoice[]).some((choice) => choice.isCorrect === true);
        if (type === 'switch' && requiredAnswer)
          return (value === 'yes' && requiredAnswer === 'yes') || (value === 'no' && requiredAnswer === 'no');
        return value || (typeof value === 'boolean' && value === false);
      });
  };

  return {
    responseStatuses,
    responseStatusesGroup,
    getRenewalStatusText,
    areRequiredQuestionsAnswered,
    isEvidenceUploaded,
  };
};

export default useResponseUtils;
