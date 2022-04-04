import { IOrganization } from "../../interfaces/IOrganization";
import { IUser } from "../../interfaces/IUser";
import getEmailTemplate from "./template";

const getMentionEmail = ({ user, message }: { user: IUser, message: string }, organization: IOrganization) => {
  const body = `
    <p style="text-align: center;"><span style="font-size: 24px;">Welcome to Conforme</span></p>
    <p style="text-align: center;">&#xA0;</p>
    <p>Dear ${user.displayName}</p>,
    <p>Message is: ${message.replace(`@@@(${user.firstName})[${user._id}]`, `<span style="display:inline-block;color:#FF9A00; font-weight:bold">${user.firstName}</span>`)} </p>
    <br/>
    <p>Thank you for choosing Conforme</p>
  `;
  return getEmailTemplate({ body, organization });
};

export default getMentionEmail;
