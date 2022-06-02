const getReponseDueMail = (
  template,
  { daysToDueDate, firstName, _id, complianceName, clientUrl }
) => {
  template = template.split("%FirstName%").join(firstName);
  template = template.split("%ComplianceItemName%").join(complianceName);
  template = template
    .split("#%Link%")
    .join(
      `<a href=${clientUrl}/tracker/compliance-item/${_id} target="_blank">here</a>`
    );
  template = template
    .split("%Link%")
    .join(
      `<a href=${clientUrl}/tracker/compliance-item/${_id} target="_blank">here</a>`
    );

  const dueText =
    daysToDueDate >= 0
      ? `is due in ${daysToDueDate} ${daysToDueDate === 1 ? "day" : "days"}`
      : `was due ${daysToDueDate * -1} ${
          daysToDueDate === -1 ? "day ago" : "days ago"
        }`;
  template = template.split("%DueText%").join(dueText);

  return template;
};

export default getReponseDueMail;
