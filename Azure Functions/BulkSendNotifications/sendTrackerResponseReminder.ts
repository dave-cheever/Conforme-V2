import { Context } from "@azure/functions";
import IConfig from "../common/interfaces/IConfig";
import { IResponse } from "../common/interfaces/IResponse";
import Notifications from "../common/services/collections/Notifications";
import Organizations from "../common/services/collections/Organizations";
import Response from "../common/services/collections/Response";
import Settings from "../common/services/collections/Settings";
import { EmailService } from "../common/services/EmailService";
import { GraphService } from "../common/services/GraphService";
import {
  getEmailSubject,
  getEmailTemplate,
} from "../common/services/notifications";
import { getCircularReplacer, getDaysToDueDate, getProtocol } from "../common/utils";

const sendTrackerResponseReminder = async (config: IConfig, context: Context) => {
  const organizations = await Organizations.aggregate([
    {
      $match: {
        "metatags.removedAt": { $eq: null },
      },
    },
  ]);

  const emailType = 'trackerResponseReminder';
  const emailService = new EmailService(config);
  for (const organization of organizations) {
    try {
      const emailDays = await Settings.customFindOneByName(`${emailType}EmailDates`, organization._id);
      if (!emailDays) {
        throw new Error(`Can not find email dates setting "${emailType}EmailDates".`);
      }
      const responseDays = emailDays.value;

      const pipeline: any[] = [
        {
          $match: {
            "metatags.removedAt": { $eq: null },
            organizationId: organization._id,
          },
        },
        {
          $lookup: {
            from: "trackerItems",
            localField: "trackerItemId",
            foreignField: "_id",
            as: "trackerItem",
          },
        },
        {
          $unwind: {
            path: "$trackerItem",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      // Get all responses for organization
      const responses: IResponse[] = await Response.aggregate(pipeline);

      // Set daysToDueDate for responses
      responses.map((response) => (response.daysToDueDate = getDaysToDueDate(response)));

      // Filter responses by daysToDueDate
      const filteredResponses = responses.filter(({ daysToDueDate }) =>
        responseDays.includes(daysToDueDate)
      );

      for (const response of filteredResponses) {
        let notificationId: string;
        let notificationMetatags = {};
        try {
          const graphService = new GraphService(config);
          const recipients = [];

          const accountable = await graphService.getUserData({
            organization,
            userId: response.accountableId,
          });
          if (accountable) {
            recipients.push({
              displayName: accountable.displayName,
              firstName: accountable.givenName,
              email: accountable.mail,
            });
          }

          const responsible = await graphService.getUserData({
            organization,
            userId: response.responsibleId,
          });
          if (responsible) {
            recipients.push({
              displayName: responsible.displayName,
              firstName: responsible.givenName,
              email: responsible.mail,
            });
          }

          const {
            _id,
            daysToDueDate,
            trackerItem,
            dueDate,
          } = response;

          const subject = await getEmailSubject({
            emailType,
            emailData: {
              trackerItemName: trackerItem.name,
            },
            organization,
          });

          // TODO: For now take the first tracker module.
          // Need to add module scope to tracker objects in order to fix it.
          const module = organization.modules.find(({ type }) => type === 'tracker');

          for (const recipient of recipients) {
            const emailData = {
              trackerName: trackerItem.name,
              trackerResponseLink: `${getProtocol()}${organization.domain}/${module.path}/tracker-item/${_id}`,
              dueDate: dueDate,
              daysToDueDate,
              firstName: recipient.firstName || recipient.displayName.split(' ')[0],
              _id,
            };

            const body = await getEmailTemplate({
              emailType,
              emailData,
              modulePath: module.path,
              organization,
            });

            // Save notification in database
            const notification = await Notifications.customCreate({
              emailType,
              emailData,
              status: 'pending',
              to: recipients,
              scope: {
                moduleId: module?._id,
              },
            }, 'system', organization._id);
            notificationId = notification._id;
            notificationMetatags = notification.metatags;

            await emailService.sendEmail({
              to: [recipient.email],
              subject,
              body,
            });
            await Notifications.updateOne({ _id: notificationId }, {
              status: "sent",
              metatags: {
                ...notification.metatags,
                updatedAt: new Date(),
              },
            });
          }
        } catch (e) {
          const error = JSON.stringify({ message: e.message, response: e.response }, getCircularReplacer);
          await Notifications.updateOne({ _id: notificationId }, {
            error,
            metatags: {
              ...notificationMetatags,
              updatedAt: new Date(),
            },
          });
          context.log.error(`Tracker response reminder notification failed for response ${response._id}.`);
          context.log.error(error);
        }
      }
    } catch (e) {
      const error = JSON.stringify({ message: e.message, response: e.response }, getCircularReplacer);
      context.log.error(`Tracker response reminder notification failed for organization ${organization._id}.`);
      context.log.error(error);
    }
  }
};

export default sendTrackerResponseReminder;
