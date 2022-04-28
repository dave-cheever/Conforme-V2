import { IOrganization } from '../../interfaces/IOrganization';
import Organizations from '../collections/Organizations';
import getAuditsWeeklyDigestEmailTemplate from './audits-weekly-digest';
import getMentionEmail from './mentionEmail';
import getSkeleton from './template';

export const MENTION_EMAIL = 0;
export const AUDITS_WEEKLY_DIGEST_EMAIL = 1;
export const AUDITS_STATUS_REMINDER = 2;

const getEmailSubject = (emailType: number, emailData = {}) => {
  switch (emailType) {
    case MENTION_EMAIL:
      return 'You have been mentioned in chat';
    case AUDITS_WEEKLY_DIGEST_EMAIL:
      return 'Audits weekly digest';
    case AUDITS_STATUS_REMINDER:
      return 'Audits status reminder';
  }
};

const getEmailTemplate = async ({
  emailType,
  template,
  emailData,
  organization,
  organizationId
}: {
  emailType: number;
  emailData: any;
  organizationId?: string;
  organization?: IOrganization;
  template?: string;
}) => {
  let body: string;
  switch (emailType) {
    case MENTION_EMAIL:
      body = getMentionEmail(emailData);
      break;
    case AUDITS_WEEKLY_DIGEST_EMAIL:
      body = getAuditsWeeklyDigestEmailTemplate(template, emailData);
      break;
  }
  if (!organization) {
    if (!organizationId) {
      throw Error('You need to pass either organization or organizationId');
    }
    organization = await Organizations.customFindById(organizationId);
  }
  return getSkeleton(body, organization);
};

export { getEmailSubject, getEmailTemplate };
