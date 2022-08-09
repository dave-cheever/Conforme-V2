import { IResponse } from "../common/interfaces/IResponse";
import Organizations from "../common/services/collections/Organizations";
import Response from "../common/services/collections/Response";
import Settings from "../common/services/collections/Settings";
import { GraphService } from "../common/services/GraphService";
import {
  getEmailSubject,
  getEmailTemplate,
} from "../common/services/notifications";
import { getTemplateDetails } from "../common/utils";

const sendResponseWeeklyEmail = async (emailType: string, config) => {
  const organizations = await Organizations.aggregate([
    {
      $match: {
        "metatags.removedAt": { $eq: null },
      },
    },
  ]);

  const { emailSettingName, templateSettingName } =
    getTemplateDetails(emailType);

  for (const organization of organizations) {

    const emailsValue = await Settings.customFindOneByName(
      emailSettingName,
      organization._id
    );

    const template = await Settings.customFindOneByName(
      templateSettingName,
      organization._id
    );

    if (!emailsValue || !template) {
      continue;
    }

    const recipients = emailsValue.value;

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
          from: "complianceItems",
          localField: "complianceItemId",
          foreignField: "_id",
          as: "complianceItem",
        },
      },
      {
        $unwind: {
          path: "$complianceItem",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    //get all responses by organization id
    const responses: IResponse[] = await Response.aggregate(pipeline);

    const graphService = new GraphService(config);

    for (const response of responses) {
      const responsibleDetails = await GraphService.getUserData({
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

    const subject = getEmailSubject(emailType);

    const body = await getEmailTemplate({
      emailType,
      emailData: {
        responses,
      },
      template: template.value,
      modulePath: module.path,
      organization,
    });

    await graphService.sendDirectEmail({
      from: config.EmailSender,
      to: recipients,
      subject,
      body,
    });
  }
};

export default sendResponseWeeklyEmail;
