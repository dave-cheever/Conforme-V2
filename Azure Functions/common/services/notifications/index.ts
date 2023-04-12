import camelCase from "lodash/camelCase";

import { IOrganization } from '../../interfaces/IOrganization';
import Settings from '../collections/Settings';
import getActionAssignedEmailTemplate from './action-assigned';
import getActionCompletedEmailTemplate from "./action-completed";
import getActionOverdueEmailTemplate from "./action-overdue";
import getAuditMissedEmailTemplate from "./audit-missed";
import getAuditUpcomingEmailTemplate from "./audit-upcoming";
import getMentionEmail from './mentionEmail';
import getTrackerResponseReminder from './tracker-response-reminder';
import getResponseWeeklyEmail from './response-weekly-email';
import getSkeleton from './template';

const getEmailSubject = async ({
  emailType,
  emailData = {},
  organization,
}: {
  emailType?: string;
  emailData?: any;
  organization: IOrganization;
}) => {
  const subjectSetting = await Settings.customFindOneByName(`${emailType}EmailSubject`, organization._id);
  if (!subjectSetting) {
    throw new Error(`Can not find email template setting "${emailType}EmailSubject".`);
  }

  let subject: string;
  switch (emailType) {
    default:
      subject = subjectSetting.value;
      for (const option of subjectSetting.options) {
        subject = subject.split(`%${option}%`).join(emailData[camelCase(option)]);
      }
  }
  return subject;
};

const getEmailTemplate = async ({
  emailType,
  emailData,
  organization,
  modulePath,
  translations = {},
}: {
  emailType?: string;
  emailData: any;
  organization: IOrganization;
  modulePath: string;
  translations?: { [word: string]: string };
}) => {
  const template = await Settings.customFindOneByName(`${emailType}EmailTemplate`, organization._id);
  if (!template) {
    throw new Error(`Can not find email template setting "${emailType}EmailTemplate".`);
  }

  let body: string;
  switch (emailType) {
    case 'actionAssigned':
      body = getActionAssignedEmailTemplate(template.value, emailData);
      break;
    case 'actionCompleted':
      body = getActionCompletedEmailTemplate(template.value, emailData);
      break;
    case 'actionOverdue':
      body = getActionOverdueEmailTemplate(template.value, emailData);
      break;
    case 'auditMissed':
      body = getAuditMissedEmailTemplate(template.value, emailData);
      break;
    case 'auditUpcoming':
      body = getAuditUpcomingEmailTemplate(template.value, emailData);
      break;
    case 'userMentioned':
      body = getMentionEmail(template.value, emailData);
      break;
    case 'trackerResponseReminder':
      body = getTrackerResponseReminder(template.value, emailData);
      break;
    case 'trackerResponsesDigest':
      body = getResponseWeeklyEmail(template.value, emailData);
      break;
    default:
      body = template.value;
      for (const option of template.options) {
        body = body.split(`%${option}%`).join(emailData[camelCase(option)]);
      }
  }
  return getSkeleton(body, organization, modulePath);
};

export { getEmailTemplate, getEmailSubject };
