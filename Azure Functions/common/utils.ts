import { addDays, addMonths, addWeeks, addYears, differenceInCalendarDays, differenceInDays, isSameDay } from 'date-fns';

import { IResponse } from "./interfaces/IResponse";
import { AUDITS_WEEKLY_DIGEST_EMAIL, AUDITS_STATUS_REMINDER, RESPONSE_REMINDER_EMAIL, RESPONSE_WEEKLY_EMAIL } from './services/notifications';

export const getProtocol = () => {
  return process.env.ENV?.toLowerCase() === "dev" ? "http://" : "https://";
};

export const genMetatags = (
  action: "added" | "updated" | "removed",
  userId: string
) => {
  return {
    [`${action}By`]: userId,
    [`${action}At`]: new Date(),
  };
};

export const getTemplateDetails = (
  emailType: number
): {
  templateSettingName: string;
  emailSettingName?: string;
} => {
  switch (emailType) {
    case AUDITS_WEEKLY_DIGEST_EMAIL:
    case AUDITS_STATUS_REMINDER:
      return {
        templateSettingName: "auditsWeeklyDigestEmailTemplate",
        emailSettingName: "auditsWeeklyDigestEmailAddress",
      };

    case RESPONSE_REMINDER_EMAIL:
      return {
        templateSettingName: "responseRemainderEmailTemplate",
        emailSettingName: "responseDueEmailDays",
      };

    case RESPONSE_WEEKLY_EMAIL:
      return {
        templateSettingName: "responseWeeklyEmailTemplate",
        emailSettingName: "responseWeeklyEmailAddress",
      };
  }
};

const getNextDueDate = (dueDate: Date, frequency: string) => {
  let newdueDate;

  switch (frequency) {
    case 'Daily':
      newdueDate = addDays(dueDate, 1);
      break;

    case 'Weekly':
      newdueDate = addWeeks(dueDate, 1);
      break;

    case 'Monthly':
      newdueDate = addMonths(dueDate, 1);
      break;

    case 'Quarterly':
      newdueDate = addMonths(dueDate, 3);
      break;

    case '6 months':
      newdueDate = addMonths(dueDate, 6);
      break;

    case 'Annual':
      newdueDate = addYears(dueDate, 1);
      break;

    case '2 years':
      newdueDate = addYears(dueDate, 2);
      break;

    case '3 years':
      newdueDate = addYears(dueDate, 3);
      break;

    case '5 years':
      newdueDate = addYears(dueDate, 5);
      break;

    default:
      newdueDate = null;
      break;
  }
  return newdueDate;
};

// get daysToDueDate for response
export const getDaysToDueDate = (response: IResponse) => {
  if (!response.nextRenewalDate) return null;

  const start = new Date(response.nextRenewalDate);
  const end = new Date();
  if (isSameDay(start, end)) return 0;

  return differenceInCalendarDays(start, end);
};
