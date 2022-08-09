import { logger } from './logger';

export const paramMissingError = 'One or more of the required parameters was missing.';

export const pErr = (err: Error) => {
  if (err) logger.error(err);
};

export const getRandomInt = () => Math.floor(Math.random() * 1_000_000_000_000);

export const ACTION_ASSIGNED = 'ACTION_ASSIGNED';
export const ACTION_COMPLETED = 'ACTION_COMPLETED';
export const ACTION_OVERDUE = 'ACTION_OVERDUE';
export const AUDIT_MISSED = 'AUDIT_MISSED';
export const AUDITS_WEEKLY_SUMMARY = 'AUDITS_WEEKLY_SUMMARY';
export const MENTION_NOTIFICATION = 'MENTION_NOTIFICATION';
export const TRACKER_RESPONSE_ASSIGNED = 'TRACKER_RESPONSE_ASSIGNED';
export const TRACKER_REVIEW_SUBMITTED = 'TRACKER_REVIEW_SUBMITTED';
export const TRACKER_REMINDER = 'TRACKER_REMINDER';
export const TRACKER_WEEKLY_SUMMARY = 'TRACKER_WEEKLY_SUMMARY';
