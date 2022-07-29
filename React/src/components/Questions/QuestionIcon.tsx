import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

const QuestionIcon = ({ type, ...props }) => {
  switch (type) {
    case 'textConfirm':
      return <QuestionTextIcon {...props} />;
    case 'textMultilineConfirm':
      return <QuestionTextIcon {...props} />;
    case 'switch':
      return <QuestionToggleIcon {...props} />;
    case 'datePicker':
      return <QuestionDateIcon {...props} />;
    default:
      return null;
  }
};

export default QuestionIcon;
