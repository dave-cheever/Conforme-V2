import Initialize from '../start';
Initialize();

import { AzureFunction, Context } from '@azure/functions';

import { ConfigService } from '../common/services/ConfigService';
import { LoggingService } from '../common/services/LoggingService';
import { StorageService } from '../common/services/StorageService';
import { endOfWeek, getHours, getMinutes, isAfter, isBefore, isSameDay, isSameWeek, parseISO, set, startOfWeek, sub } from 'date-fns';
import sendDigest from './sendDigest';
import {
  getEmailSubject,
  getEmailTemplate,
  TRACKER_REMINDER,
  TRACKER_WEEKLY_SUMMARY
} from '../common/services/notifications';
import sendUpcomingAudits from './sendUpcomingAudits';
import sendMissedAudits from './sendMissedAudits';
import sendOverdueActions from './sendOverdueActions';
import sendResponseWeeklyEmail from './sendResponseWeeklyEmail';
import sendResponseDueEmail from './sendResponseDueEmail';
import Notifications from '../common/services/collections/Notifications';
import Settings from "../common/services/collections/Settings";
import { getTemplateDetails } from '../common/utils';
import { EmailService } from '../common/services/EmailService';

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const now = new Date();
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(context, 'CONFORME - BULK SEND NOTIFICATIONS', config);

  try {
    const storageService = new StorageService(config, 'notifications');

    // Scheduled notifications are sent only between the configured hours
    if (
      isAfter(now, set(now, { hours: config.ScheduledStartHour, minutes: 0, seconds: 0, milliseconds: 0 })) && // after scheduled start hour
      isBefore(now, set(now, { hours: config.ScheduledEndHour, minutes: 0, seconds: 0, milliseconds: 0 })) && // before scheduled end hour
      getMinutes(now) === 0 && // at the beginning of an hour
      ((getHours(now) - config.ScheduledStartHour) % config.ScheduledFrequency) === 0 // every x hours depends on configured frequency
    ) {
      loggingService.Write('Scheduled notifications triggered');

      // Get last scheduled notification date
      const lastBulkScanDateEntity = await storageService.getItem('lastBulkScanDate');
      const lastBulkScanDate = parseISO(lastBulkScanDateEntity?.Value?._) || new Date(0);

      // Save the current date as the last scheduled scan date
      await storageService.addItem(now, 'lastBulkScanDate', 'lastBulkScanDate');

      // Send weekly digest if now and last scan date is different week
      if (!isSameWeek(now, lastBulkScanDate)) {
        loggingService.Write('Weekly notifications triggered');
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
        loggingService.Write('Daily notifications triggered');
        await sendUpcomingAudits(config);
        await sendMissedAudits(config);
        await sendOverdueActions(config);
        await sendResponseDueEmail(TRACKER_REMINDER, config);
      }

      loggingService.Write('Scheduled notifications sent');

      // TODO: Send Audits and Tracker responses changes after last scan date
    }

    // Instant notifications are sent every 5 minutes
    const notifications = await Notifications.find({ status: "pending" }).lean();
    const notificationsSent = await Promise.all(notifications.map(async notification => {
      try {
        const template = await Settings.customFindOneByName(notification.emailData.template, notification.organizationId);
        const organizationConfigService = new ConfigService();
        await organizationConfigService.getConfig(notification.organizationId);
        const organization = organizationConfigService?.getOrganization();
        const module = organization?.modules?.find((module) => module._id === notification.scope.moduleId);

        const subject = getEmailSubject(notification.emailType, notification.emailData);
        const body = await getEmailTemplate({
          emailType: notification.emailType,
          emailData: notification.emailData,
          modulePath: module?.path,
          template: template.value,
          organization,
        });

        const emailService = new EmailService(config);
        const emailResponseStatus = await emailService.sendEmail({
          to: notification.to,
          subject,
          body,
        });

        if (emailResponseStatus === 202) {
          await Notifications.updateOne({ _id: notification._id }, { status: "sent" });
          return true;
        }
        return false;
      } catch (notificationError) {
        context.log(notificationError.message);
        context.log(notificationError.response.body);
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
