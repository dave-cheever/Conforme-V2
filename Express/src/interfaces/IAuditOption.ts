//
// Currently there is just one type of option, but in a future there might be more
//
// Notification holds an ID of email template as a value
//

export type IAuditOption = {
  type: 'notification';
  name: string;
  value: string;
};
