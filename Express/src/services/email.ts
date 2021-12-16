import { IOrganization } from "app-interfaces";
import { Users } from "app-models";
import { GraphService } from "app-services";
import { MENTION_EMAIL } from "app-utils";

export const sendMentionedEmail = async ({
 userIds,
  organization,
  message,
}: {
  userIds: any[];
  organization: IOrganization;
  message: String;
}) => {
  //get all information for user;
  for (const id of userIds) {
    
    const user = await Users.customFindByIdWithDetails({ userId: id, organization });

    await GraphService.sendEmail({
      emailType: MENTION_EMAIL,
      emailData: { user, message },
      organization,
      from: organization.emailAddress,
      to: [user.email],
    });
}
}