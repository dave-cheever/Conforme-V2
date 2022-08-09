import { differenceInCalendarDays, isSameDay } from 'date-fns';

import { IResponse } from "./interfaces/IResponse";
import { AUDITS_WEEKLY_SUMMARY, AUDIT_MISSED, MENTION_NOTIFICATION, TRACKER_REMINDER, TRACKER_WEEKLY_SUMMARY } from './services/notifications';

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
  emailType: string
): {
  templateSettingName: string;
  emailSettingName?: string;
} => {
  switch (emailType) {
    case AUDITS_WEEKLY_SUMMARY:
    case AUDIT_MISSED:
      return {
        templateSettingName: "auditsWeeklyDigestEmailTemplate",
        emailSettingName: "auditsWeeklyDigestEmailAddress",
      };

    case TRACKER_REMINDER:
      return {
        templateSettingName: "responseRemainderEmailTemplate",
        emailSettingName: "responseDueEmailDays",
      };

    case TRACKER_WEEKLY_SUMMARY:
      return {
        templateSettingName: "responseWeeklyEmailTemplate",
        emailSettingName: "responseWeeklyEmailAddress",
      };
    case MENTION_NOTIFICATION:
      return {
        templateSettingName: "mentionedNotificationEmailTemplate",
      }
    default:
      ({
        templateSettingName: "",
        emailSettingName: ""
      })
  }
};

// get daysToDueDate for response
export const getDaysToDueDate = (response: IResponse) => {
  if (!response.nextRenewalDate) return null;

  const start = new Date(response.nextRenewalDate);
  const end = new Date();
  if (isSameDay(start, end)) return 0;

  return differenceInCalendarDays(start, end);
};

/**
 * 
 * This function is used to do one-time translation with passed translations object
 * 
 * @param word Word to be translated
 * @param translations Module configuration object with translations
 */
export const t = (word: string, translations: { [word: string]: string; }) => {
  return translations[word] || word;
};
