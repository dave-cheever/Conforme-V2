import { getProtocol } from '../../utils';

const getAuditMissedEmailTemplate = (template, emailData) => {
  template = template.split('%AreaName%').join(emailData.areaName);
  template = template.split('%LinkTo%').join(`<a href="${getProtocol()}${emailData.auditPath}">here</a>`);
  return template;
};

export default getAuditMissedEmailTemplate;
