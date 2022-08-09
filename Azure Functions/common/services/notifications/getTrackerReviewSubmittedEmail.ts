const getTrackerReviewSubmittedEmail = (template, { trackerItemName, trackerItemPath }) => {
  template = template.split('%TrackerItemName%').join(trackerItemName);
  template = template.split('%LinkTo%').join(trackerItemPath);

  return template;
};

export default getTrackerReviewSubmittedEmail;