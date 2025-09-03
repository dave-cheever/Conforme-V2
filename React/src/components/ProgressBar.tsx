import React from 'react';

import { Progress } from '@chakra-ui/react';

interface IProgressBar {
  value: number;
}

function ProgressBar({ value }: IProgressBar) {
  return (
    <Progress
      data-id="030925-a4239f"
      borderRadius="20px"
      colorScheme="#FFFFFF"
      height={1}
      mr="2"
      value={value}
      width={55} />
  );
}

export default ProgressBar;
