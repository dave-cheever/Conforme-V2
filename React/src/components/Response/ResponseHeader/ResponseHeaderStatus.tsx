import { useEffect, useState } from 'react';

import { Flex, Stack, Text, VStack } from '@chakra-ui/react';

import { ErrorCircleIcon, SuccessCircleIcon } from '../../../icons';

function ResponseHeaderStatus({ heading, status }) {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (status === 'Yes') setColor('responseHeaderStatus.yes');
    else if (status === 'No') setColor('responseHeaderStatus.no');
    else setColor('responseHeaderStatus.default');
  }, [status]);

  const renderIcon = () => {
    if (status === 'Yes') return <SuccessCircleIcon data-id="000815" h="18px" w="18px" />;

    if (status === 'No') return <ErrorCircleIcon data-id="000816" h="18px" w="18px" />;

    return null;
  };

  return (
    <VStack
      align="left"
      alignItems={['start', 'start']}
      data-id="000817"
      direction="column"
      spacing={2}
      w={['max-content', 'max-content']}
    >
      <Flex
        color="responseHeaderStatus.heading"
        data-id="000818"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="14px"
      >
        {heading}
      </Flex>
      <Stack align="center" data-id="000819" direction="row" pr="10px" spacing={2}>
        {renderIcon()}
        <Text color={color} data-id="000820" fontSize="smm" fontStyle="normal" fontWeight="bold" lineHeight="20px">
          {status}
        </Text>
      </Stack>
    </VStack>
  );
}

export default ResponseHeaderStatus;

export const responseHeaderStatusStyles = {
  responseHeaderStatus: {
    yes: '#41B916',
    no: '#E93C44',
    default: '#818197',
    heading: '#2D3748',
  },
};
