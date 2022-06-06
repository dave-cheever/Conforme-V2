import Initialize from '../start';
Initialize();

import { AzureFunction, Context } from '@azure/functions';

import { ConfigService } from '../common/services/ConfigService';
import { LoggingService } from '../common/services/LoggingService';
import { StorageService } from '../common/services/StorageService';
import { endOfWeek, isSameDay, isSameWeek, parseISO, startOfWeek, sub } from 'date-fns';
import sendDigest from './sendDigest';
import {
  AUDITS_ACTION_OVERDUE,
  AUDITS_STATUS_REMINDER,
  AUDITS_WEEKLY_DIGEST_EMAIL,
  RESPONSE_REMINDER_EMAIL,
  RESPONSE_WEEKLY_EMAIL
} from '../common/services/notifications';
import sendComingUpAudits from './sendComingUpAudits';
import sendMissedAudits from './sendMissedAudits';
import sendMissedActions from './sendMissedActions';
import sendResponseWeeklyEmail from './sendResponseWeeklyEmail';
import sendResponseDueEmail from './sendResponseDueEmail';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(context, 'CONFORME - BULK SEND NOTIFICATIONS', config);

  try {
    const storageService = new StorageService(config, 'notifications');
    const lastBulkScanDateEntity = await storageService.getItem('lastBulkScanDate');
    const lastBulkScanDate = parseISO(lastBulkScanDateEntity?.Value?._) || new Date(0);

    // Save the current date as the last scan date
    await storageService.addItem(new Date(), 'lastBulkScanDate', 'lastBulkScanDate');

    // Send tracker responses and audits updates
    const lastSentLog = await storageService.getItem('lastSentLog');
    // TODO

    // Send weekly digest if now and last scan date is different week
    if (!isSameWeek(new Date(), lastBulkScanDate)) {
      const lastWeek = sub(new Date(), { weeks: 1 });
      await sendDigest(
        {
          since: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
          emailType: AUDITS_WEEKLY_DIGEST_EMAIL
        },
        config
      );
      await sendResponseWeeklyEmail( RESPONSE_WEEKLY_EMAIL , config);
    }

    if (!isSameDay(new Date(), lastBulkScanDate)) {
      await sendComingUpAudits(AUDITS_STATUS_REMINDER, config);
      await sendMissedAudits(AUDITS_STATUS_REMINDER, config);
      await sendMissedActions(AUDITS_ACTION_OVERDUE, config);
      await sendResponseDueEmail(RESPONSE_REMINDER_EMAIL, config);
    }

    // TODO
    // const notifications = await AuditLogs.find({
    //   _id: { $gt: "pending" },
    //   "metatags.removedAt": { $eq: null },
    // }).lean();
    // await Promise.all(
    //   notifications.map(async (notification) => {
    //     await graphService.sendEmail({
    //       from: config.EmailSender,
    //       emailType: notification.emailType,
    //       emailData: notification.emailData,
    //       to: notification.to,
    //       organization: configService.getOrganization(),
    //     });
    //   })
    // );
    loggingService.Write('Bulk notifications sent.');
  } catch (error) {
    // log any error message
    context.log.error(error);
  }
};

export default timerTrigger;
