import React from 'react';

import { Progress } from '@chakra-ui/react';

interface IProgressBar {
  value: number;
}

const ProgressBar = ({ value }: IProgressBar) => (
  <Progress
    borderRadius="20px"
    colorScheme="#FFFFFF"
    height={1}
    mr="2"
    value={value}
    width={55}
  />
);

export default ProgressBar;
