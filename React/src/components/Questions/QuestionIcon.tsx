import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

const QuestionIcon = ({type, ...props}) => {
  switch (type) {
    case 'text':
      return <QuestionTextIcon {...props} />;
    case 'toggle':
      return <QuestionToggleIcon {...props} />;
    case 'datePicker':
      return <QuestionDateIcon {...props} />;
    default:
      return null;
  };
};

export default QuestionIcon;
