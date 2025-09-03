import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

function QuestionIcon({ type, ...props }) {
  switch (type) {
    case 'textConfirm':
      return <QuestionTextIcon data-id="030925-9cc1fc" {...props} />;
    case 'textMultilineConfirm':
      return <QuestionTextIcon data-id="030925-c2db9f" {...props} />;
    case 'switch':
      return <QuestionToggleIcon data-id="030925-75010a" {...props} />;
    case 'datePicker':
      return <QuestionDateIcon data-id="030925-76dd51" {...props} />;
    default:
      return null;
  }
}

export default QuestionIcon;
