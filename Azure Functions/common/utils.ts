import { AUDITS_WEEKLY_DIGEST_EMAIL } from "./services/notifications";

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
  emailSettingName: string;
} => {
  switch (emailType) {
    case AUDITS_WEEKLY_DIGEST_EMAIL:
      return {
        templateSettingName: "auditsWeeklyDigestEmailTemplate",
        emailSettingName: "auditsWeeklyDigestEmailAddress",
      };
  }
};
