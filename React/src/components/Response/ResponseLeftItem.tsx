import { Box, Text, Flex } from "@chakra-ui/react";

const ResponseLeftItem = ({
  heading,
  value,
}: {
  heading: string;
  value: string;
}) => {
  return (
    <Flex h="50px" flexDir="column" mt={2} align="flex-start">
      <Box opacity={0.5} fontSize="11px">
        {heading}
      </Box>
      <Text noOfLines={1} textOverflow="ellipsis" fontSize="14px">
        {value || "-"}
      </Text>
    </Flex>
  );
};

export default ResponseLeftItem;
