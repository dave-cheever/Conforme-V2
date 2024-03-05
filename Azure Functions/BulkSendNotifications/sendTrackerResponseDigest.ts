import { Context } from "@azure/functions";
import IConfig from "../common/interfaces/IConfig";
import { IResponse } from "../common/interfaces/IResponse";
import Notifications from "../common/services/collections/Notifications";
import Organizations from "../common/services/collections/Organizations";
import Response from "../common/services/collections/Response";
import Settings from "../common/services/collections/Settings";
import { EmailService } from "../common/services/EmailService";
import { GraphService } from "../common/services/GraphService";
import { getEmailSubject, getEmailTemplate } from "../common/services/notifications";
import { getCircularReplacer } from "../common/utils";

const sendResponseWeeklyEmail = async (config: IConfig, context: Context) => {
  const organizations = await Organizations.aggregate([
    {
      $match: {
        "metatags.removedAt": { $eq: null },
      },
    },
  ]);

  const emailType = 'trackerResponsesDigest';
  const emailService = new EmailService(config);
  for (const organization of organizations) {
    let notificationId: string;
    let notificationMetatags = {};
    try {
      const recipients = await Settings.customFindOneByName(`${emailType}EmailAddress`, organization._id);
      if (!recipients) {
        throw new Error(`Can not find email address setting "${emailType}EmailAddress".`);
      }

      const pipeline: any[] = [
        {
          $match: {
            "metatags.removedAt": { $eq: null },
            organizationId: organization._id,
            status: { $ne: "completed" },
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

      //get all responses by organization id
      const responses: IResponse[] = await Response.aggregate(pipeline);

      const graphService = new GraphService(config);
      for (const response of responses) {
        const responsibleDetails = await graphService.getUserData({
          organization,
          userId: response.responsibleId,
        });

        response.responsible = {
          _id: response.responsibleId,
          displayName: responsibleDetails.displayName,
          firstName: responsibleDetails.givenName,
          lastName: responsibleDetails.surname,
          email: responsibleDetails.mail,
          metatags: {
            addedBy: "",
            addedAt: new Date(),
          },
        };
      }


      // TODO: For now take the first tracker module.
      // Need to add module scope to tracker objects in order to fix it.
      const module = organization.modules.find(({ type }) => type === 'tracker');

      const emailData = { responses };
      const subject = await getEmailSubject({ emailType, organization });
      const body = await getEmailTemplate({
        emailType,
        emailData,
        modulePath: module.path,
        organization,
      });

      // Save notification in database
      const notification = await Notifications.customCreate({
        emailType,
        emailData: { responsesIds: emailData.responses.map(({ _id }) => _id).join(', ') },
        status: 'pending',
        to: recipients.value,
        scope: {
          moduleId: module?._id,
        },
      }, 'system', organization._id);
      notificationId = notification._id;
      notificationMetatags = notification.metatags;

      await emailService.sendEmail({
        to: recipients.value,
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
    } catch (e) {
      const error = JSON.stringify({ message: e.message, response: e.response }, getCircularReplacer);
      await Notifications.updateOne({ _id: notificationId }, {
        error,
        metatags: {
          ...notificationMetatags,
          updatedAt: new Date(),
        },
      });
      context.log.error(`Tracker response weekly digest notification failed for organization ${organization._id}.`);
      context.log.error(error);
    }
  }
};

export default sendResponseWeeklyEmail;
