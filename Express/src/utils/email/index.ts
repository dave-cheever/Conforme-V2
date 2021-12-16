import getMentionEmail from "./mentionEmail";
import emailPreview from "./emailPreview";
import { IOrganization } from "app-interfaces";

export const MENTION_EMAIL = 0;

const getEmailSubject = (emailType: number, emailData) => {
  switch (emailType) {
    case 0:
      return "You have been mentioned in chat";
  }
};

const getEmailTemplate = async (emailType: number, emailData, organization: IOrganization) => {
  switch (emailType) {
    case 0:
      return getMentionEmail(emailData, organization);
  }
};

export { getEmailSubject, getEmailTemplate, emailPreview };
