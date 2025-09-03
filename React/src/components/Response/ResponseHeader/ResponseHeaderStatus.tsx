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
    if (status === 'Yes') return <SuccessCircleIcon data-id="030925-855d16" h="18px" w="18px" />;

    if (status === 'No') return <ErrorCircleIcon data-id="030925-cc96c1" h="18px" w="18px" />;

    return null;
  };

  return (
    <VStack
      data-id="030925-5b7170"
      align="left"
      alignItems={['start', 'start']}
      direction="column"
      spacing={2}
      w={['max-content', 'max-content']}
    >
      <Flex
        data-id="030925-a4750f"
        color="responseHeaderStatus.heading"
        fontSize="16px"
        fontStyle="normal"
        fontWeight="600"
        lineHeight="14px"
      >
        {heading}
      </Flex>
      <Stack data-id="030925-c7e479" align="center" direction="row" pr="10px" spacing={2}>
        {renderIcon()}
        <Text data-id="030925-a896b5" color={color} fontSize="smm" fontStyle="normal" fontWeight="bold" lineHeight="20px">
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
