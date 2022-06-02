import { IResponse } from "../common/interfaces/IResponse";
import Organizations from "../common/services/collections/Organizations";
import Response from "../common/services/collections/Response";
import Settings from "../common/services/collections/Settings";
import { GraphService } from "../common/services/GraphService";
import {
  getEmailSubject,
  getEmailTemplate,
} from "../common/services/notifications";
import { getDaysToDueDate, getTemplateDetails } from "../common/utils";

const sendResponseDueEmail = async (emailType: number, config) => {
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
    const emailDays = await Settings.customFindOneByName(
      emailSettingName,
      organization._id
    );

    const template = await Settings.customFindOneByName(
      templateSettingName,
      organization._id
    );

    if (!emailDays || !template) {
      continue;
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

    //set daysToDueDate for responses
    responses.map(
      (response) => (response.daysToDueDate = getDaysToDueDate(response))
    );

    //filter responses by daysToDueDate
    const filteredResponses = responses.filter(({ daysToDueDate }) =>
      responseDays.includes(daysToDueDate)
    );

    for (const response of filteredResponses) {
      const accountableDetails = await GraphService.getUserData({
        organization,
        userId: response.accountableId,
      });

      response.accountable = {
        _id: response.accountableId,
        displayName: accountableDetails.displayName,
        email: accountableDetails.mail,
        metatags: {
          addedBy: "",
          addedAt: new Date(),
        },
      };

      const responsibleDetails = await GraphService.getUserData({
        organization,
        userId: response.responsibleId,
      });

      response.responsible = {
        _id: response.responsibleId,
        displayName: responsibleDetails.displayName,
        firstName: responsibleDetails.givenName,
        email: responsibleDetails.mail,
        metatags: {
          addedBy: "",
          addedAt: new Date(),
        },
      };
    }

    const graphService = new GraphService(config);

    for (const response of filteredResponses) {
      const {
        _id,
        daysToDueDate,
        complianceItem,
        accountable,
        responsible,
        nextRenewalDate,
      } = response;

      const recipients = [...[accountable], ...[responsible]];

      const subject = getEmailSubject(emailType, {
        complianceName: complianceItem.name,
      });

      for (const recipient of recipients) {
        const body = await getEmailTemplate({
          emailType,
          emailData: {
            complianceName: complianceItem.name,
            clientUrl: organization.domain,
            dueDate: nextRenewalDate,
            daysToDueDate,
            firstName: recipient.firstName || recipient.displayName,
            _id,
          },
          template: template.value,
          organization,
        });

        await graphService.sendDirectEmail({
          from: config.EmailSender,
          to: [recipient.email],
          subject,
          body,
        });
      }
    }
  }
};

export default sendResponseDueEmail;
