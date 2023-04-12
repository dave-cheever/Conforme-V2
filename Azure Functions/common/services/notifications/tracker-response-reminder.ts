const getTrackerResponseReminder = (
  template,
  { daysToDueDate, firstName, _id, trackerName, trackerResponseLink }
) => {
  template = template.split("%FirstName%").join(firstName);
  template = template.split("%TrackerItemName%").join(trackerName);
  template = template.split("#%Link%").join(`<a href="${trackerResponseLink}" target="_blank">here</a>`);
  template = template.split("%Link%").join(`<a href="${trackerResponseLink}" target="_blank">here</a>`);

  const dueText =
    daysToDueDate >= 0
      ? `is due in ${daysToDueDate} ${daysToDueDate === 1 ? "day" : "days"}`
      : `was due ${daysToDueDate * -1} ${daysToDueDate === -1 ? "day ago" : "days ago"
      }`;
  template = template.split("%DueText%").join(dueText);

  return template;
};

export default getTrackerResponseReminder;
