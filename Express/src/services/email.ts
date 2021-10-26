import nodemailer, { SendMailOptions } from 'nodemailer';

import { logger } from 'app-shared';
import { getEmailSubject, getEmailTemplate } from 'app-utils';

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async ({ emailType, emailData, from, to }: { emailType: number, emailData: any, from: string, to: string }) => {
  const mailOptions: SendMailOptions = {
    from,
    to,
    subject: getEmailSubject(emailType, emailData),
    html: await getEmailTemplate(emailType, emailData)
  };

  const response = new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, error => {
      if (error) {
        logger.error(error);
        resolve(false);
      }
      resolve(true);
    });
  });

  return await response;
}

export default {
  sendEmail
};
