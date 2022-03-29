import { IOrganization } from 'app-interfaces';

import emailPreview from './emailPreview';
import getMentionEmail from './mentionEmail';

export const MENTION_EMAIL = 0;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getEmailSubject = (emailType: number, emailData) => {
  switch (emailType) {
    case 0:
      return 'You have been mentioned in chat';
    default:
      break;
  }
};

const getEmailTemplate = async (
  emailType: number,
  emailData,
  organization: IOrganization,
) => {
  switch (emailType) {
    case 0:
      return getMentionEmail(emailData, organization);
    default:
      break;
  }
};

export { getEmailSubject, getEmailTemplate, emailPreview };
