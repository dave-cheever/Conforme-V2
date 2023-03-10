import { useEffect, useState } from 'react';

import { Flex, Stack, Text, VStack } from '@chakra-ui/react';

import { CheckIcon, CrossIcon } from '../../../icons';

const ResponseHeaderStatus = ({ heading, status }) => {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (status === 'Yes') setColor('responseHeaderStatus.yes');
    else if (status === 'No') setColor('responseHeaderStatus.no');
    else setColor('responseHeaderStatus.default');
  }, [status]);

  const renderIcon = () => {
    if (status === 'Yes') return <CheckIcon data-id="d33d21096bf0" stroke={color} w="16px" />;

    if (status === 'No') return <CrossIcon data-id="d5b1b5516efd" stroke={color} w="16px" />;

    return null;
  };

  return (
    (<VStack
      align="left"
      alignItems={['start', 'start']}
      data-id="37c215c3f2bf"
      direction="column"
      spacing={2}
      w={['max-content', 'max-content']}>
      <Flex
        color="responseHeaderStatus.heading"
        data-id="dcb6a9a637c6"
        fontSize="ssm"
        fontStyle="normal"
        fontWeight="semi_medium"
        lineHeight="16px">
        {heading}
      </Flex>
      <Stack
        align="center"
        data-id="7b19fb5447df"
        direction="row"
        pr="10px"
        spacing={2}>
        {renderIcon()}
        <Text
          color={color}
          data-id="8010c9b2d7c9"
          fontSize="smm"
          fontStyle="normal"
          fontWeight="bold"
          lineHeight="20px">
          {status}
        </Text>
      </Stack>
    </VStack>)
  );
};

export default ResponseHeaderStatus;

export const responseHeaderStatusStyles = {
  responseHeaderStatus: {
    yes: '#41B916',
    no: '#E93C44',
    default: '#818197',
    heading: '#282F3680',
  },
};
