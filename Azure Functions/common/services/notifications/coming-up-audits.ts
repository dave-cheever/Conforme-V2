const getComingUpAuditsEmailTemplate = (template, { comingUpAudits }) => {
  template = template.split('%ComingUpAudits%').join(comingUpAudits);
  return template;
};

export default getComingUpAuditsEmailTemplate;
