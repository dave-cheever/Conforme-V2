//
// Currently there is just one type of option, but in a future there might be more
//
// Notification holds and ID of email template as a value
//

export type IAuditOption = {
  type: 'notification';
  name: string;
  setting: string;
};
