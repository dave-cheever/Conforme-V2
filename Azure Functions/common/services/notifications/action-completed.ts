import { getProtocol } from '../../utils';

const getActionCompletedEmailTemplate = (template, emailData) => {
  template = template.split('%ActionTitle%').join(emailData.actionTitle);
  template = template.split('%LinkTo%').join(`<a href="${getProtocol()}${emailData.actionPath}">here</a>`);
  return template;
};

export default getActionCompletedEmailTemplate;
