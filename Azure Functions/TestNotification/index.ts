import { AzureFunction, Context, HttpRequest } from "@azure/functions";

import { ConfigService } from "../common/services/ConfigService";
import { LoggingService } from "../common/services/LoggingService";
import sendAuditsDigest from "../BulkSendNotifications/sendAuditsDigest";
import sendMissedAudits from "../BulkSendNotifications/sendMissedAudits";
import sendOverdueActions from "../BulkSendNotifications/sendOverdueActions";
import sendTrackerResponseDigest from "../BulkSendNotifications/sendTrackerResponseDigest";
import sendTrackerResponseReminder from "../BulkSendNotifications/sendTrackerResponseReminder";
import sendUpcomingAudits from "../BulkSendNotifications/sendUpcomingAudits";
import { endOfWeek, startOfWeek, sub } from "date-fns";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const now = new Date();
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(
    context,
    "CONFORME - TEST SEND NOTIFICATIONS",
    config
  );

  if (config.Environment.toLowerCase() === 'production') {
    context.res = {
      status: 400,
      body: "You can\'t test notifications in production.",
    };
    return;
  }

  const notificationName = req.query?.notificationName;

  if (!notificationName) {
    context.res = {
      status: 400,
      body: "Please pass a function name in the request body.",
    };
    return;
  }

  switch (notificationName) {
    case "sendAuditsDigest": {
      const lastWeek = sub(now, { weeks: 1 });
      sendAuditsDigest(
        {
          since: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
        },
        config,
        context
      );
      break;
    }
    case "sendMissedAudits":
      sendMissedAudits(config, context);
      break;
    case "sendOverdueActions":
      sendOverdueActions(config, context);
      break;
    case "sendTrackerResponseDigest":
      sendTrackerResponseDigest(config, context);
      break;
    case "sendTrackerResponseReminder":
      sendTrackerResponseReminder(config, context);
      break;
    case "sendUpcomingAudits":
      sendUpcomingAudits(config, context);
      break;
    default:
      context.res = {
        status: 400,
        body: "Please pass a function name in the request body.",
      }
      return;
  }

  context.res = {
    body: `Function ${notificationName} successfully executed.`,
  };
};

export default httpTrigger;