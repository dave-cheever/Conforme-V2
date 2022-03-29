import { Box, Flex, Text } from '@chakra-ui/react';

const ResponseLeftItem = ({
  heading,
  value,
}: {
  heading: string;
  value: string;
}) => (
  <Flex align="flex-start" flexDir="column" h="50px" mt={2}>
    <Box fontSize="11px" opacity={0.5}>
      {heading}
    </Box>
    <Text fontSize="14px" noOfLines={1} textOverflow="ellipsis">
      {value || '-'}
    </Text>
  </Flex>
);

export default ResponseLeftItem;
