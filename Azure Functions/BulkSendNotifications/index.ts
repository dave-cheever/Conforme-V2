import Initialize from "../start";
Initialize();

import { AzureFunction, Context } from "@azure/functions"

import Notifications from "../common/services/collections/Notifications";
import { ConfigService } from "../common/services/ConfigService";
import { GraphService } from "../common/services/GraphService";
import { LoggingService } from "../common/services/LoggingService";

const timerTrigger: AzureFunction = async function (context: Context): Promise<void> {
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(context, "CONFORME - BULK SEND NOTIFICATIONS", config);

  try {
    const graphService = new GraphService(config);
    const notifications = await Notifications.find({
      status: { $not: "pending" },
      "metatags.removedAt": { $eq: null },
    }).lean();
    await Promise.all(notifications.map(async (notification) => {
      await graphService.sendEmail({
        from: config.EmailSender,
        emailType: notification.emailType,
        emailData: notification.emailData,
        to: notification.to,
        organization: configService.getOrganization(),
      });
    }));
    loggingService.Write('Bulk notifications sent.');
  } catch (error) {
    // log any error message
    context.log.error(error);
  }
};

export default timerTrigger;
