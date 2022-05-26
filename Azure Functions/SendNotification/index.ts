import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import Notifications from '../common/services/collections/Notifications';
import { ConfigService } from '../common/services/ConfigService';
import { GraphService } from '../common/services/GraphService';
import { LoggingService } from '../common/services/LoggingService';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const configService = new ConfigService();
  let config = await configService.getConfig();
  const loggingService = new LoggingService(context, 'CONFORME - SEND NOTIFICATION', config);
  await loggingService.Debug(`Body: ${JSON.stringify(req.body)}`);

  try {
    const { organizationId, notificationId } = req.body;

    // Check supplied params
    if (!notificationId || !organizationId) {
      loggingService.Write('SEND NOTIFICATION - Not all required params supplied.');
      context.res = {
        status: 400,
        body: 'Please pass one of the required parameters on the query string or request body.'
      };
    } else {
      config = await configService.getConfig(organizationId);
      const graphService = new GraphService(config);
      const notification = await Notifications.customFindById(notificationId, organizationId);
      if (notification.status !== 'pending') {
        loggingService.Write('SEND NOTIFICATION - Notification is processing or was already sent.');
        context.res = {
          status: 400,
          body: 'Notification is processing or was already sent.'
        };
      } else {
        await graphService.sendEmail({
          from: config.EmailSender,
          emailType: notification.emailType,
          emailData: notification.emailData,
          to: notification.to,
          organization: configService.getOrganization()
        });
        context.res = {
          body: 'Notification sent.'
        };
      }
    }
  } catch (error) {
    // log any error message
    context.log.error(error);
    // set response status code to 400 and set error message to body
    context.res = {
      status: 400,
      body: error.message
    };
  }
};

export default httpTrigger;
