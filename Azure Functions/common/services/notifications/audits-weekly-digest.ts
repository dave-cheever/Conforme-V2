const getAuditsWeeklyDigestEmailTemplate = (template, { numberOfAudits }) => {
  template = template.split("%NumberOfAudits%").join(numberOfAudits);
  return template;
};

export default getAuditsWeeklyDigestEmailTemplate;
