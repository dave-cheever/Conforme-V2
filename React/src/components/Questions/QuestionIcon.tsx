import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

const QuestionIcon = ({ type, ...props }) => {
  switch (type) {
    case 'text':
      return <QuestionTextIcon {...props} />;
    case 'switch':
      return <QuestionToggleIcon {...props} />;
    case 'textMultiline':
      return <QuestionTextIcon {...props} />;
    case 'datePicker':
      return <QuestionDateIcon {...props} />;
    default:
      return null;
  };
};

export default QuestionIcon;
