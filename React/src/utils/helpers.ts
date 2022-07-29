export const getFieldEmptyValue = (fieldType: string) => {
  switch (fieldType) {
    case 'textConfirm': {
      return '';
    }
    case 'textMultilineConfirm': {
      return '';
    }
    default:
      break;
  }
};

export const questionHeader = (questionType) => {
  switch (questionType) {
    case 'textConfirm':
      return 'Text input question';
    case 'textMultilineConfirm':
      return 'Multiline text input question';
    case 'switch':
      return 'Yes / No question';
    case 'datepicker':
      return 'Date input';
    case 'multipleChoice':
      return 'Multiple choices';
    case 'singleChoice':
      return 'Single choices';
    case 'numeric':
      return 'Numeric';
    case 'email':
      return 'Require email';
    default:
      break;
  }
};

export const responsePermissionByFilterType = (filterType) => {
  switch (filterType) {
    case 'accountableId':
      return 'accountable';
    case 'responsibleId':
      return 'responsible';
    case 'contributorsIds':
      return 'contributor';
    case 'followersIds':
      return 'follower';
    default:
      break;
  }
};

export const generateTabColors = (i, errors, complianceItem, visitedTab, selectedSectionIndex): { bg: string; color: string } => {
  switch (i) {
    case 0:
      if (Object.keys(errors).length !== 0) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 1:
      if (complianceItem?.locationsIds?.length === 0 && visitedTab > i) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 2:
      if (complianceItem?.businessUnitsIds?.length === 0 && visitedTab > i) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 3:
      if (
        (complianceItem.evidenceItems?.length === 0 || complianceItem.evidenceItems?.some((evidence) => evidence === '')) &&
        (complianceItem.questions?.filter(({ required, outdated }) => required && !outdated)?.length === 0 ||
          complianceItem.evidenceItems?.some((evidence) => evidence === '')) &&
        visitedTab > i
      ) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 4:
      if (
        complianceItem.evidenceItems?.length === 0 &&
        complianceItem.questions?.filter(({ required, outdated }) => required && !outdated)?.length === 0 &&
        visitedTab >= i
      ) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    default:
      break;
  }

  if (i === selectedSectionIndex) {
    return {
      bg: 'navigationModal.section.selected.bg',
      color: 'navigationModal.section.selected.color',
    };
  }
  if (i < visitedTab) {
    return {
      bg: 'navigationModal.section.correct.bg',
      color: 'navigationModal.section.correct.color',
    };
  }
  return {
    bg: 'navigationModal.section.unselected.bg',
    color: 'navigationModal.section.unselected.color',
  };
};

export const getFieldNameByAction = (action: string) => {
  let fieldAction = '';
  switch (action) {
    case 'add':
      fieldAction = 'Added new';
      break;
    case 'delete':
      fieldAction = 'Deleted';
      break;
    case 'update':
      fieldAction = 'Updated';
      break;
    case 'snapshot':
      fieldAction = 'Created snapshot of';
      break;
    default:
      break;
  }

  return fieldAction;
};

export const getSingularCollectionName = (collection: string) => {
  let fieldCollection = '';
  switch (collection) {
    case 'actions':
      fieldCollection = 'action';
      break;
    case 'answers':
      fieldCollection = 'answer';
      break;
    case 'audits':
      fieldCollection = 'audit';
      break;
    case 'auditTypes':
      fieldCollection = 'audit type';
      break;
    case 'businessUnits':
      fieldCollection = 'business unit';
      break;
    case 'categories':
      fieldCollection = 'category';
      break;
    case 'complianceItems':
      fieldCollection = 'compliance item';
      break;
    case 'comments':
      fieldCollection = 'comment';
      break;
    case 'functionalAreas':
      fieldCollection = 'functional area';
      break;
    case 'locations':
      fieldCollection = 'location';
      break;
    case 'questions':
      fieldCollection = 'question';
      break;
    case 'questionsCategories':
      fieldCollection = 'questions category';
      break;
    case 'regulatoryBodies':
      fieldCollection = 'regulatory body';
      break;
    case 'responses':
      fieldCollection = 'response';
      break;
    case 'settings':
      fieldCollection = 'setting';
      break;
    default:
      break;
  }

  return fieldCollection;
};

export const getPathByCollectionName = (collection: string) => {
  let path = '';
  switch (collection) {
    case 'actions':
      path = 'actions';
      break;
    case 'complianceItems':
      path = 'compliance-item';
      break;

    default:
      break;
  }
  return path;
};

export const getLabelByField = (field: string) => {
  let fieldName = '';
  switch (field) {
    case 'name':
      fieldName = 'Name';
      break;
    case 'description':
      fieldName = 'Description';
      break;
    case 'categoryId':
      fieldName = 'Category';
      break;
    case 'regulatoryBodyId':
      fieldName = 'Regulatory body';
      break;
    case 'functionalAreaId':
      fieldName = 'Functional area';
      break;
    case 'contributorsIds':
      fieldName = 'Contributor';
      break;
    case 'responsibleId':
      fieldName = 'Responsible';
      break;
    case 'followersIds':
      fieldName = 'Follower';
      break;
    case 'frequency':
      fieldName = 'Frequency';
      break;
    case 'businessUnitsIds':
      fieldName = 'Business units';
      break;
    case 'evidenceItems':
      fieldName = 'Evidence items';
      break;
    case 'retentionPeriod':
      fieldName = 'Retention period';
      break;
    case 'published':
      fieldName = 'Published';
      break;
    case 'status':
      fieldName = 'Status';
      break;
    case 'comments':
      fieldName = 'Comments';
      break;
    case 'reference':
      fieldName = 'Reference';
      break;
    case 'delegateIds':
      fieldName = 'Delegates';
      break;
    case 'evidence':
      fieldName = 'Evidence';
      break;
    case 'ed':
      fieldName = 'Executive director';
      break;
    case 'value':
      fieldName = 'Value';
      break;
    case 'lastCompletionDate':
      fieldName = 'Date of Last Completion';
      break;
    case 'lastRenewalDate':
      fieldName = 'Date of Last Renewal';
      break;
    case 'nextRenewalDate':
      fieldName = 'Date of Next Renewal';
      break;
    case 'auditorId':
      fieldName = 'Auditor';
      break;
    case 'participantsIds':
      fieldName = 'Participants';
      break;
    case 'auditTypeId':
      fieldName = 'Audit type';
      break;
    case 'dueDate':
      fieldName = 'Due date';
      break;
    case 'walkType':
      fieldName = 'Walk type';
      break;
    case 'siteId':
      fieldName = 'Site';
      break;
    case 'areaId':
      fieldName = 'Area';
      break;
    case 'startingDate':
      fieldName = 'Starting date';
      break;
    case 'sections':
      fieldName = 'Sections';
      break;
    case 'type':
      fieldName = 'Type';
      break;
    case 'question':
      fieldName = 'Question';
      break;
    case 'questionsCategoryId':
      fieldName = 'Questions category';
      break;
    case 'positiveValue':
      fieldName = 'Positive value';
      break;
    case 'negativeValue':
      fieldName = 'Negative value';
      break;
    case 'withAnswers':
      fieldName = 'With answers';
      break;
    case 'allowCustomQuestions':
      fieldName = 'Allow custom questions';
      break;
    case 'maxQuestionsNumber':
      fieldName = 'Max questions number';
      break;
    case 'icon':
      fieldName = 'Icon';
      break;
    case 'options':
      fieldName = 'Options';
      break;
    case 'showInInsights':
      fieldName = 'Show in insights';
      break;
    case 'notBlockedAfterCompletion':
      fieldName = 'Not blocked after completion';
      break;
    default:
      fieldName = field;
      break;
  }

  return fieldName;
};

export const getFieldNameByValues = (value: string) => {
  let fieldValue = '';
  switch (value) {
    case 'notStarted':
      fieldValue = 'Not started';
      break;
    case 'inProgress':
      fieldValue = 'In progress';
      break;
    case 'completed':
      fieldValue = 'Completed';
      break;
    default:
      fieldValue = value;
      break;
  }

  return fieldValue;
};

export const getInitials = (name = '') => {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0)).join('');
  return initials.toUpperCase();
};
