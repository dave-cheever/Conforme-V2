
export const getFieldEmptyValue = (fieldType: string) => {
  switch (fieldType) {
    case 'text': {
      return '';
    }
  }
};

export const questionHeader = (questionType) => {
  switch (questionType) {
    case 'text':
      return 'Text input question';
    case 'switch':
      return 'Yes / No question';
    case 'datepicker':
      return 'Date input';
    case 'multipleChoice':
      return 'Multiple choices'
    case 'singleChoice':
      return 'Single choices'
    case 'numeric':
      return "Numeric";
    case 'email':
      return "Require email"
  }
};

export const responsePermissionByFilterType = (filterType) => {
  switch (filterType) {
    case "accountableId":
      return "accountable";
    case "responsibleId":
      return "responsible";
    case "contributorsIds":
      return "contributor";
    case "followersIds":
      return "follower";
  }
};

export const generateLabelColor = (i, errors, complianceItem, visitedTab, selectedSectionIndex) => {
  switch (i) {
    case 0:
      if(Object.keys(errors).length !== 0) {
        return "navigationModal.section.error.bg"
      }
      break;
    case 1:
      if (complianceItem?.businessUnitsIds?.length === 0 && visitedTab > i) {
        return "navigationModal.section.error.bg"
      } 
      break;
    case 2:
      if (complianceItem.evidenceItems?.length === 0 
          && complianceItem.questions?.filter(({ required, outdated }) => required 
          && !outdated)?.length === 0 
          && visitedTab > i) {
        return "navigationModal.section.error.bg"
      }
      break;
    case 3:
      if (complianceItem.evidenceItems?.length === 0 
          && complianceItem.questions?.filter(({ required, outdated }) => required 
          && !outdated)?.length === 0 
          && visitedTab >= i) {
        return "navigationModal.section.error.bg"
      }
      break;
  }

  if(i === selectedSectionIndex) {
    return "navigationModal.section.selected.bg" 
  } else {
    return "navigationModal.section.unselected.bg"
  }
}
