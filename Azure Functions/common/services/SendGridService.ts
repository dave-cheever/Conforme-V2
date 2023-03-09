import sgMail from '@sendgrid/mail';
import IConfig from '../interfaces/IConfig';
import { IEmail } from '../interfaces/IEmail';

export class SendGridService {
  private _sender: string;

  public constructor(config: IConfig) {
    sgMail.setApiKey(config.SendGridAPIKey);
    this._sender = config.EmailSender;
  }

  public async sendEmail(email: IEmail): Promise<number> {
    const emailObject: sgMail.MailDataRequired = {
      from: this._sender,
      to: email.to,
      cc: email.cc,
      bcc: email.bcc,
      subject: email.subject,
      html: email.body,
    };
    const res: sgMail.ClientResponse = await new Promise((resolve, reject) => {
      sgMail
        .send(emailObject)
        .then((response) => {
          resolve(response[0]);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return res.statusCode;
  }
};
