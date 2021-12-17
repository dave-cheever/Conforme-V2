import { isInteger } from "lodash";

import { IResponse } from '../interfaces/IResponse';
import { useAppContext } from '../contexts/AppProvider';
import { differenceInDays, startOfDay } from "date-fns";

export const responseStatuses = {
  "completed": "Completed",
  "notStarted": "Not started",
  "inProgress": "In progress",
  "comingUp": "Coming up",
  "overdue": "Overdue",
  "noDueDate": "No due date",
  "all": "All",
  "compliant": "Compliant",
  "nonCompliant": "Non-compliant"
};

export const responseStatusesGroup = {
  "nonCompliant": "Non-compliant",
  "comingUp": "Coming up",
  "compliant": "Compliant"
}

export const complianceItemFrequencies = [
  "Monthly",
  "Quarterly",
  "6 months",
  "Annual",
  "2 years",
  "3 years",
  "5 years",
  "Variable",
  "Ad-hoc"
];

const useResponseUtils = () => {
  const { settings } = useAppContext();
  const comingUpTriggers = settings.find(
    (el) => el.name === 'comingUpTriggers'
  );

  const getRenewalStatus = (response: IResponse) => {
    const { daysToDueDate, status } = response;
    if (status === 'completed' && daysToDueDate && response.complianceItem.frequency && daysToDueDate !== null && daysToDueDate <= comingUpTriggers?.value?.[response.complianceItem.frequency] && daysToDueDate >= 0) {
      // If there is less then or equal comingUpTriggers value and at least 0 days to due date
      return 'comingUp';
    } else if (daysToDueDate && daysToDueDate < 0) {
      // If there is less than 0 days to due date
      return 'overdue';
    }
    // If there is more than comingUpTriggers value days to due date
    // Return one of standard renewal status - "notStarted", "inProgress" or "completed"
    return status;
  };

  const getRenewalStatusText = (response: IResponse) => {
    const renewalStatus = getRenewalStatus(response);
    const { daysToDueDate } = response;
    switch (renewalStatus) {
      case 'notStarted':
        return 'Not started';
      case 'inProgress':
        switch (true) {
          case (daysToDueDate && daysToDueDate < -1):
            return `Due ${daysToDueDate && (daysToDueDate * -1)} days ago`;
          case (daysToDueDate === -1):
            return 'Due yesterday';
          case (daysToDueDate === 0):
            return 'Due today';
          case (daysToDueDate === 1):
            return 'Due tomorrow';
          case (daysToDueDate === null):
            return 'No due date';
          default:
            return `Due in ${daysToDueDate} days`;
        }
      case 'completed':
        const daysToNextRenewal = differenceInDays(startOfDay(new Date()), startOfDay(response.nextRenewalDate ? new Date(response.nextRenewalDate) : new Date())) * -1;
        if (isInteger(daysToNextRenewal)) {
          return `Next due in ${daysToNextRenewal} days`;
        }
        return `Completed`;
      case 'comingUp':
        if (daysToDueDate === 0) {
          return `Due today`;
        }
        if (daysToDueDate === 1) {
          return `Due tomorrow`;
        }
        return `Due in ${daysToDueDate} days`;
      case 'overdue':
        if (daysToDueDate === -1) {
          return `Due yesterday`;
        }
        return `Due ${daysToDueDate && (daysToDueDate * -1)} days ago`;
    }
  };

  const getStatus = (response: IResponse) => {
    if (response.status === 'completed' && (!response.daysToDueDate || response.daysToDueDate >= 0)) {
      // If status is "completed" and (there is no due date or response is not overdue)
      return 'compliant';
    }
    return 'nonCompliant';
  };


  const isEvidenceUploaded = (response: IResponse) => {
    return response?.evidence?.filter(({ outdated }) => !outdated).every(({ uploaded }) => uploaded);
  };

  const areRequiredQuestionsAnswered = (response: IResponse) => {
    return response?.questions?.filter(({ outdated, required }) => !outdated && required).every(({ value }) => value || (typeof value === 'boolean' && value === false));
  };

  return {
    areRequiredQuestionsAnswered,
    getRenewalStatus,
    getRenewalStatusText,
    getStatus,
    isEvidenceUploaded,
  };
};

export default useResponseUtils;
