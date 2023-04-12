import { getProtocol } from '../../utils';

const getActionOverdueEmailTemplate = (template, emailData) => {
  template = template.split('%ActionTitle%').join(emailData.actionTitle);
  template = template.split('%LinkTo%').join(`<a href="${getProtocol()}${emailData.actionPath}">here</a>`);
  return template;
};

export default getActionOverdueEmailTemplate;
