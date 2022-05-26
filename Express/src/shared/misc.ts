import { logger } from './logger';

export const paramMissingError = 'One or more of the required parameters was missing.';

export const pErr = (err: Error) => {
  if (err) logger.error(err);
};

export const getRandomInt = () => Math.floor(Math.random() * 1_000_000_000_000);

export const MENTION_EMAIL = 0;
export const AUDITS_WEEKLY_DIGEST_EMAIL = 1;
export const AUDITS_STATUS_REMINDER = 2;
export const AUDITS_ACTION_ASSIGNED = 3;
export const AUDITS_ACTION_COMPLETED = 4;
export const AUDITS_ACTION_OVERDUE = 5;
