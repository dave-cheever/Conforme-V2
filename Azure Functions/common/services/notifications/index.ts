import { IOrganization } from '../../interfaces/IOrganization';
import { getProtocol } from '../../utils';
import Organizations from '../collections/Organizations';
import getAuditsWeeklyDigestEmailTemplate from './audits-weekly-digest';
import getMentionEmail from './mentionEmail';
import getReponseDueMail from './response-due-mail';
import getResponseWeeklyEmail from './response-weekly-email';
import getSkeleton from './template';

export const ACTION_ASSIGNED = 'ACTION_ASSIGNED';
export const ACTION_COMPLETED = 'ACTION_COMPLETED';
export const ACTION_OVERDUE = 'ACTION_OVERDUE';
export const AUDIT_MISSED = 'AUDIT_MISSED';
export const AUDIT_UPCOMING = 'AUDIT_UPCOMING';
export const AUDITS_WEEKLY_SUMMARY = 'AUDITS_WEEKLY_SUMMARY';
export const MENTION_NOTIFICATION = 'MENTION_NOTIFICATION';
export const TRACKER_REMINDER = 'TRACKER_REMINDER';
export const TRACKER_WEEKLY_SUMMARY = 'TRACKER_WEEKLY_SUMMARY';

const getEmailSubject = (emailType: string, emailData: any = {}) => {
  switch (emailType) {
    case ACTION_ASSIGNED:
      return 'You have been assigned to an action';
    case ACTION_COMPLETED:
      return 'An action has been completed';
    case ACTION_OVERDUE:
      return 'Audit action overdue';
    case AUDIT_MISSED:
      return 'Audit has been missed';
    case AUDIT_UPCOMING:
      return 'Upcoming audit';
    case AUDITS_WEEKLY_SUMMARY:
      return 'Audits weekly digest';
    case MENTION_NOTIFICATION:
      return "You have been mentioned in chat";
    case TRACKER_REMINDER:
      return `Compliance Item Reminder: ${emailData.complianceName}`;
    case TRACKER_WEEKLY_SUMMARY:
      return `Compliance Item Weekly Overview`;
  }
};

const getEmailTemplate = async ({
  emailType,
  template,
  emailData,
  organization,
  organizationId,
}: {
  emailType: string;
  emailData: any;
  organizationId?: string;
  organization?: IOrganization;
  template?: string;
}) => {
  let body: string;
  switch (emailType) {
    case ACTION_ASSIGNED:
      body = `<p>
        You have been assigned to action "${emailData.actionTitle} (${emailData.actionDueDate
        })", to view click <a href="${getProtocol()}${process.env.API_URL}/${emailData.actionPath}">here</a>.
        </p>`;
      break;
    case ACTION_COMPLETED:
      body = `<p>
        Action "${emailData.actionTitle}" has been completed, to view click <a href = "${getProtocol()}${process.env.API_URL}/${emailData.actionPath}">here</a>.
      </p>`;
      break;
    case ACTION_OVERDUE:
      body = `<p>
        Action "${emailData.actionTitle}" is overdue, to view click <a href="${getProtocol()}${process.env.API_URL}/${emailData.actionPath}">here</a>.
      </p>`;
      break;
    case AUDIT_MISSED:
      body = `<p>
        Audit has been missed for ${emailData.areaName}, to view click <a href="${getProtocol()}${process.env.API_URL}/${emailData.auditPath}">here</a>.
      </p>`;
      break;
    case AUDIT_UPCOMING:
      body = `<p>
        You have upcoming audit for ${emailData.areaName}, to view click <a href="${getProtocol()}${process.env.API_URL}/${emailData.auditPath}">here</a>.
      </p>`;
      break;
    case AUDITS_WEEKLY_SUMMARY:
      body = getAuditsWeeklyDigestEmailTemplate(template, emailData);
      break;
    case MENTION_NOTIFICATION:
      body = getMentionEmail(emailData);
      break;
    case TRACKER_REMINDER:
      body = getReponseDueMail(template, emailData);
      break;
    case TRACKER_WEEKLY_SUMMARY:
      body = getResponseWeeklyEmail(template, emailData);
      break;
  }
  if (!organization) {
    if (!organizationId) {
      throw Error("You need to pass either organization or organizationId");
    }
    organization = await Organizations.customFindById(organizationId);
  }
  return getSkeleton(body, organization);
};

export { getEmailSubject, getEmailTemplate };
