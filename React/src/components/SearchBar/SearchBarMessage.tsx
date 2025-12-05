import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

interface SearchBarMessageProps {
  icon: React.ComponentType<{ boxSize?: string; color?: string }>;
  heading?: string;
  text: string;
}

function SearchBarMessage({ icon: IconComponent, heading, text }: Readonly<SearchBarMessageProps>) {
  return (
    <Flex
      data-id="003378"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={4}>
      <Box data-id="003379" mb={2}>
        <IconComponent data-id="003380" boxSize="34px" />
      </Box>
      {heading && (
        <Text
          data-id="003381"
          fontWeight={600}
          fontSize="16px"
          color="#4A5568"
          textAlign="center"
          mb={1}>
          {heading}
        </Text>
      )}
      <Text
        data-id="003382"
        fontWeight={500}
        fontSize="14px"
        color="#718096"
        textAlign="center">
        {text}
      </Text>
    </Flex>
  );
}

export default SearchBarMessage;

