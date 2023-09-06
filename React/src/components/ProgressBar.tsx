import React from 'react';

import { Progress } from '@chakra-ui/react';

interface IProgressBar {
  value: number;
}

function ProgressBar({ value }: IProgressBar) {
  return <Progress
    borderRadius="20px"
    colorScheme="#FFFFFF"
    data-id="ffb3138d2811"
    height={1}
    mr="2"
    value={value}
    width={55} />
}

export default ProgressBar;
