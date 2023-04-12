import { differenceInCalendarDays, isSameDay } from 'date-fns';

import { IResponse } from './interfaces/IResponse';

export const getProtocol = () => {
  return process.env.ENV?.toLowerCase() === 'dev' ? 'http://' : 'https://';
};

export const genMetatags = (action: 'added' | 'updated' | 'removed', userId: string) => {
  return {
    [`${action}By`]: userId,
    [`${action}At`]: new Date()
  };
};

// get daysToDueDate for response
export const getDaysToDueDate = (response: IResponse) => {
  if (!response.dueDate) return null;

  const start = new Date(response.dueDate);
  const end = new Date();
  if (isSameDay(start, end)) return 0;

  return differenceInCalendarDays(start, end);
};

/**
 *
 * This function is used to do one-time translation with passed translations object
 *
 * @param word Word to be translated
 * @param translations Module configuration object with translations
 */
export const t = (word: string, translations: { [word: string]: string }) => {
  return translations[word] || word;
};
