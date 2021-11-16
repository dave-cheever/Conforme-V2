
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
    case 'toggle':
      return 'Yes / No question';
    case 'datePicker':
      return 'Date input';
  }
};
