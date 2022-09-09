//
// If you edit any of the functions below, you must also edit the corresponding use case
// Search for the function name and replace it with updated function
// That is required because JSONfn doesn't serialize other functions called from the function
// and it will throw an error
//

const ifRACHasAccess = ({ user, response }) =>
  user && (response?.contributorsIds?.includes(user._id) || response?.accountableId === user._id || response?.responsibleId === user._id);

const ifRACFHasAccess = ({ user, response }) =>
  user &&
  (response?.contributorsIds?.includes(user._id) ||
    response?.followersIds?.includes(user._id) ||
    response?.accountableId === user._id ||
    response?.responsibleId === user._id);

const ifRAHasAccess = ({ user, response }) => user && (response?.accountableId === user._id || response?.responsibleId === user._id);

const ifHasAuditAccess = ({ user, audit }) => user && (audit?.auditorId === user._id || (audit?.participantsIds || []).includes(user._id)) && audit.status !== 'completed';

const ifHasActionAccess = ({ user, action, answer, audit }) => {
  // If an action is created from an audit
  if (action?.scope?.type === 'answer' && answer?.scope?.type === 'audit') {
    // Copy of ifHasAuditAccess
    return user && (audit?.auditorId === user._id || (audit?.participantsIds || []).includes(user._id));
  }

  return false;
};

const ifHasAnswerAccess = ({ user, answer, audit }) => {
  // If an answer is created from an audit
  if (answer?.scope?.type === 'audit') {
    // Copy of ifHasAuditAccess
    return user && (audit?.auditorId === user._id || (audit?.participantsIds || []).includes(user._id));
  }

  return false;
};

const ifHasQuestionAccess = ({ user, question, audit }) => {
  // If an answer is created from an audit
  if (question?.scope?.type === 'audit') {
    // Copy of ifHasAuditAccess
    return user && (audit?.auditorId === user._id || (audit?.participantsIds || []).includes(user._id));
  }

  return false;
};

const ifHasQuestionEditAccess = ({ user, question, questionsCategory, audit }) => {
  if (!questionsCategory.allowCustomQuestions) return false;

  // If an answer is created from an audit
  if (question?.scope?.type === 'audit') {
    // Copy of ifHasAuditAccess
    return user && (audit?.auditorId === user._id || (audit?.participantsIds || []).includes(user._id));
  }

  return false;
};

export {
  ifRAHasAccess,
  ifRACHasAccess,
  ifRACFHasAccess,
  ifHasAuditAccess,
  ifHasActionAccess,
  ifHasAnswerAccess,
  ifHasQuestionAccess,
  ifHasQuestionEditAccess,
};
