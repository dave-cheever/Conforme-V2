import { getProtocol } from '../../utils';

const getActionAssignedEmailTemplate = (template, emailData) => {
  template = template.split('%ActionTitle%').join(emailData.actionTitle);
  template = template.split('%WalkItemCategory%').join(emailData.walkItemCategory);
  template = template.split('%WalkItemName%').join(emailData.walkItemName);
  template = template.split('%ActionDueDate%').join(emailData.actionDueDate);
  template = template.split('%AssignedBy%').join(emailData.assignedBy);
  template = template.split('%LinkTo%').join(`<a href="${getProtocol()}${emailData.actionPath}">here</a>`);
  return template;
};

export default getActionAssignedEmailTemplate;
