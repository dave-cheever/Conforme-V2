import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

const QuestionIcon = ({ type, ...props }) => {
  switch (type) {
    case 'textConfirm':
      return <QuestionTextIcon data-id="1a41dbd18c2c" {...props} />;
    case 'textMultilineConfirm':
      return <QuestionTextIcon data-id="4eed1aa09cc5" {...props} />;
    case 'switch':
      return <QuestionToggleIcon data-id="c1d1ec6a9b69" {...props} />;
    case 'datePicker':
      return <QuestionDateIcon data-id="58dc599f657a" {...props} />;
    default:
      return null;
  }
};

export default QuestionIcon;
