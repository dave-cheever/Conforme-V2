import {
  differenceInDays,
  differenceInCalendarDays,
  isSameDay,
} from "date-fns";

import { IAudit } from "./interfaces/IAudit";
import { IResponse } from "./interfaces/IResponse";
import {
  AUDITS_WEEKLY_DIGEST_EMAIL,
  AUDITS_STATUS_REMINDER,
  RESPONSE_REMINDER_EMAIL,
  RESPONSE_WEEKLY_EMAIL,
} from "./services/notifications";

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

export const getAuditStatus = (audit: IAudit, auditsComingUpTriggers) => {
  if (!audit) return;

  const { dueDate, status } = audit;
  const daysToDueDate = audit.auditType?.startingDate
    ? differenceInDays(
        new Date(dueDate),
        new Date(audit.auditType?.startingDate!)
      )
    : 0;

  if (
    status === "completed" &&
    daysToDueDate !== undefined &&
    audit.auditType?.frequency &&
    daysToDueDate !== null &&
    daysToDueDate <
      auditsComingUpTriggers?.value?.[audit.auditType?.frequency] &&
    daysToDueDate >= 0
  ) {
    // If there is less then or equal comingUpTriggers value and at least 0 days to due date
    return "comingUp";
  }

  if (audit.status === "completed" && (!daysToDueDate || daysToDueDate >= 0))
    return "completed";

  if (audit.status === "inProgress" && (!daysToDueDate || daysToDueDate >= 0))
    return "inProgress";

  return "overdue";
};

// get daysToDueDate for response
export const getDaysToDueDate = (response: IResponse) => {
  if (!response.nextRenewalDate) return null;

  const start = new Date(response.nextRenewalDate);
  const end = new Date();
  if (isSameDay(start, end)) return 0;

  return differenceInCalendarDays(start, end);
};
