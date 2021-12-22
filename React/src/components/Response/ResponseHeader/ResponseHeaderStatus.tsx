
import { CheckIcon, CrossIcon } from '../../../icons';
import { Flex, Stack, VStack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';


const ResponseHeaderStatus = ({ heading, status }) => {
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (status === 'Yes') {
      setColor("responseHeaderStatus.yes");
    } else if (status === 'No') {
      setColor("responseHeaderStatus.no");
    } else {
      setColor("responseHeaderStatus.default");
    }
  }, [status]);

  const renderIcon = () => {
    if (status === 'Yes') {
      return <CheckIcon stroke={color} w="16px" />;
    } else if (status === 'No') {
      return <CrossIcon stroke={color} w="16px" />;
    }

    return null;
  }

  return (
    <VStack
      direction="column"
      align="left"
      spacing='3px'
      w={["max-content", "max-content"]}
      pr={["0", "30"]}
      alignItems={["start", "start"]}
    >
      <Flex fontStyle="normal" fontWeight="semi_medium" fontSize="ssm" lineHeight="16px" color="responseHeaderStatus.heading">{heading}</Flex>
      <Stack
        direction="row"
        spacing={2}
        align="center"
        pr="10px"
      >
        {renderIcon()}
        <Text fontStyle="normal" fontWeight="bold" fontSize="smm" lineHeight="20px" color={color}>{status}</Text>
      </Stack>
    </VStack>
  );
}

export default ResponseHeaderStatus;

export const responseHeaderStatusStyles = {
  responseHeaderStatus: {
    yes: "#41B916",
    no: "#E93C44",
    default: "#818197",
    heading: "#282F3680",
  }
}