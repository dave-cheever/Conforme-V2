import { t } from 'i18next';
import { capitalize } from 'lodash';
import { sentenceCase } from 'sentence-case';

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

export const generateTabColors = (i, errors, trackerItem, visitedTab, selectedSectionIndex): { bg: string; color: string } => {
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
      if (trackerItem?.locationsIds?.length === 0 && visitedTab > i) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 2:
      if (trackerItem?.businessUnitsIds?.length === 0 && visitedTab > i) {
        return {
          bg: 'navigationModal.section.error.bg',
          color: 'navigationModal.section.error.color',
        };
      }
      break;
    case 3:
      if (
        (trackerItem.evidenceItems?.length === 0 || trackerItem.evidenceItems?.some((evidence) => evidence === '')) &&
        (trackerItem.questions?.filter(({ required, outdated }) => required && !outdated)?.length === 0 ||
          trackerItem.evidenceItems?.some((evidence) => evidence === '')) &&
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
        trackerItem.evidenceItems?.length === 0 &&
        trackerItem.questions?.filter(({ required, outdated }) => required && !outdated)?.length === 0 &&
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
    case 'trackerItems':
      fieldCollection = 'tracker item';
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
    case 'trackerItems':
      path = 'tracker-item';
      break;

    default:
      break;
  }
  return path;
};

export const getLabelByField = (field: string) => {
  let fieldName = '';
  switch (field) {
    case 'categoryId':
      fieldName = 'Category';
      break;
    case 'regulatoryBodyId':
      fieldName = 'Regulatory body';
      break;
    case 'functionalbusinessUnitId':
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
    case 'businessUnitsIds':
      fieldName = 'Business units';
      break;
    case 'delegateIds':
      fieldName = 'Delegates';
      break;
    case 'ed':
      fieldName = 'Executive director';
      break;
    case 'lastCompletionDate':
      fieldName = 'Date of Last Completion';
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
    case 'locationId':
      fieldName = capitalize(t('location'));
      break;
    case 'businessUnitId':
      fieldName = capitalize(t('business unit'));
      break;
    case 'questionsCategoryId':
      fieldName = 'Questions category';
      break;
    default:
      fieldName = sentenceCase(field);
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

export const listSupportedFileTypes = (fileTypes: { [mimeType: string]: string[] }) => {
  const types = Object.entries(fileTypes).reduce((acc, [currMime, currExt]) => {
    let newAcc = `${acc}`;
    if (acc.length > 0) newAcc += ', ';
    if (currExt.length > 0) newAcc += `${currExt.join(', ')}`;
    else newAcc += `${currMime}`;
    return newAcc;
  }, '');
  return types;
};

export const formatEmail = (email: string) => {
  if (email.includes('#EXT#')) {
    const parts = email.split('#EXT#');
    const [local, domain] = parts[0].split('_');
    return `${local}@${domain}`;
  }
  return email;
};

/**
 * Recursively removes keys with empty arrays or empty objects from an object.
 * @param obj The object to clean
 * @returns A new object with empty arrays/objects removed
 */
export function removeEmptyArraysAndObjects(obj: any): any {
  if (Array.isArray(obj)) {
    // Clean each item in the array
    const cleanedArr = obj.map(removeEmptyArraysAndObjects).filter((item) => {
      if (Array.isArray(item)) return item.length > 0;
      if (item && typeof item === 'object') return Object.keys(item).length > 0;
      return item !== undefined && item !== null;
    });
    return cleanedArr;
  } if (obj && typeof obj === 'object') {
    const cleanedObj: any = {};
    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = removeEmptyArraysAndObjects(value);
      if (Array.isArray(cleanedValue) && cleanedValue.length === 0) return;
      if (cleanedValue && typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0) return;
      if (cleanedValue !== undefined && cleanedValue !== null) cleanedObj[key] = cleanedValue;
    });
    return cleanedObj;
  }
  return obj;
}
