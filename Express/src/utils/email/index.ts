import getMentionEmail from "./mentionEmail";
import emailPreview from "./emailPreview";

export const MENTION_EMAIL = 0;

const getEmailSubject = (emailType: number, emailData) => {
  switch (emailType) {
    case 0:
      return "You have been mentioned in chat";
  }
};

const getEmailTemplate = async (emailType: number, emailData) => {
  switch (emailType) {
    case 0:
      return getMentionEmail(emailData);
  }
};

export { getEmailSubject, getEmailTemplate, emailPreview };
