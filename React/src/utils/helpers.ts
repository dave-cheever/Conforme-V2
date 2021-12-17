
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
