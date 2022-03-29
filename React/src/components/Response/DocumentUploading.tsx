import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import Loader from '../Loader';

const DocumentUploading = ({ documentName }: { documentName: string }) => (
  <Flex
    align="center"
    borderColor="evidence.uploadBorderColor"
    borderRadius="10px"
    borderStyle="dashed"
    borderWidth="1px"
    color="brand.darkGrey"
    fontWeight="400"
    h="65px"
    justify="space-between"
    key={documentName}
    maxWidth="400px"
    role="group"
    w="full"
  >
    <Flex align="center">
      <Box
        align="center"
        bg="evidence.uploadBg"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        ml="5px"
        mr={2}
        rounded="md"
        w="55px"
      >
        <Flex align="center" h="full" justify="center">
          <Loader center size="lg" />
        </Flex>
      </Box>
      <Flex direction="column" fontSize="12px" mr={2} width="250px">
        <Text fontWeight="700" noOfLines={1} textOverflow="ellipsis">
          {documentName}
        </Text>
        <Flex opacity="0.6">Uploading ...</Flex>
      </Flex>
    </Flex>
  </Flex>
);

export default DocumentUploading;
