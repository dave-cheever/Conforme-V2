import Initialize from '../start';
Initialize();

import { AzureFunction, Context } from '@azure/functions';

import { ConfigService } from '../common/services/ConfigService';
import { LoggingService } from '../common/services/LoggingService';
import { StorageService } from '../common/services/StorageService';
import { endOfWeek, getHours, getMinutes, getTime, isAfter, isBefore, isSameDay, isSameWeek, parseISO, setHours, startOfWeek, sub } from 'date-fns';
import sendDigest from './sendDigest';
import {
  ACTION_OVERDUE,
  AUDIT_MISSED,
  AUDITS_WEEKLY_SUMMARY,
  TRACKER_REMINDER,
  TRACKER_WEEKLY_SUMMARY
} from '../common/services/notifications';
import sendUpcomingAudits from './sendUpcomingAudits';
import sendMissedAudits from './sendMissedAudits';
import sendOverdueActions from './sendOverdueActions';
import sendResponseWeeklyEmail from './sendResponseWeeklyEmail';
import sendResponseDueEmail from './sendResponseDueEmail';
import Notifications from '../common/services/collections/Notifications';
import { GraphService } from '../common/services/GraphService';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const now = new Date();
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(context, 'CONFORME - BULK SEND NOTIFICATIONS', config);

  try {
    const storageService = new StorageService(config, 'notifications');

    // Scheduled notifications are sent only between the configured hours
    if (
      isAfter(now, setHours(now, config.ScheduledStartHour)) && // after scheduled start hour
      isBefore(now, setHours(now, config.ScheduledEndHour)) && // before scheduled end hour
      getMinutes(now) === 0 && // at the beginning of an hour
      ((getHours(now) - config.ScheduledStartHour) % config.ScheduledFrequency) === 0 // every x hours depends on configured frequency
    ) {
      // Get last scheduled notification date
      const lastBulkScanDateEntity = await storageService.getItem('lastBulkScanDate');
      const lastBulkScanDate = parseISO(lastBulkScanDateEntity?.Value?._) || new Date(0);

      // Save the current date as the last scheduled scan date
      await storageService.addItem(now, 'lastBulkScanDate', 'lastBulkScanDate');

      // Send weekly digest if now and last scan date is different week
      if (!isSameWeek(now, lastBulkScanDate)) {
        const lastWeek = sub(now, { weeks: 1 });
        await sendDigest(
          {
            since: startOfWeek(lastWeek, { weekStartsOn: 1 }),
            to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
          },
          config
        );
        await sendResponseWeeklyEmail(TRACKER_WEEKLY_SUMMARY, config);
      }

      // Send daily digest if now and last scan date is different day
      if (!isSameDay(now, lastBulkScanDate)) {
        await sendUpcomingAudits(config);
        await sendMissedAudits(config);
        await sendOverdueActions(config);
        await sendResponseDueEmail(TRACKER_REMINDER, config);
      }

      loggingService.Write('Scheduled notifications sent.');

      // TODO: Send Audits and Tracker responses changes after last scan date
    }

    // Instant notifications are sent every 5 minutes
    const notifications = await Notifications.find({ status: "pending" }).lean();
    const notificationsSent = await Promise.all(notifications.map(async notification => {
      try {
        const organizationConfigService = new ConfigService();
        const organizationConfig = await organizationConfigService.getConfig(notification.organizationId);
        const graphService = new GraphService(organizationConfig);
        const emailSent = await graphService.sendEmail({
          from: organizationConfig.EmailSender,
          emailType: notification.emailType,
          emailData: notification.emailData,
          to: notification.to,
          organization: organizationConfigService.getOrganization(),
        });
        if (emailSent) {
          await Notifications.updateOne({ _id: notification._id }, { status: "sent" });
          return true;
        }
        return false;
      } catch (notificationError) {
        context.log.error(`Instant notification failed: ${notification._id}`);
      }
    }));
    loggingService.Write(`Instant notifications sent: ${notificationsSent.filter(Boolean).length}`);
  } catch (error) {
    // log any error message
    context.log.error(error);
  }
};

export default timerTrigger;
