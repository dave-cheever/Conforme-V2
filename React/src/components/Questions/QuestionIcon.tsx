import React from 'react';

import { QuestionDateIcon, QuestionTextIcon, QuestionToggleIcon } from '../../icons';

function QuestionIcon({ type, ...props }) {
  switch (type) {
    case 'textConfirm':
      return <QuestionTextIcon data-id="000276" {...props} />;
    case 'textMultilineConfirm':
      return <QuestionTextIcon data-id="000277" {...props} />;
    case 'switch':
      return <QuestionToggleIcon data-id="000278" {...props} />;
    case 'datePicker':
      return <QuestionDateIcon data-id="000279" {...props} />;
    default:
      return null;
  }
}

export default QuestionIcon;
