import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import Loader from '../Loader';

function DocumentUploading({ documentName }: { documentName: string }) {
  return (
    <Flex
      align="center"
      borderColor="evidence.uploadBorderColor"
      borderRadius="10px"
      borderStyle="dashed"
      borderWidth="1px"
      color="brand.darkGrey"
      data-id="030925-29898f"
      fontWeight="400"
      h="65px"
      justify="space-between"
      key={documentName}
      role="group"
      w="full">
      <Flex align="center" data-id="030925-95a915">
        <Box
          bg="evidence.uploadBg"
          data-id="030925-391b82"
          flexShrink={0}
          fontSize="12px"
          h="55px"
          ml="5px"
          mr={2}
          rounded="md"
          w="55px">
          <Flex align="center" data-id="030925-c53cf0" h="full" justify="center">
            <Loader center data-id="030925-6a8a33" size="lg" />
          </Flex>
        </Box>
        <Flex data-id="030925-ee165c" direction="column" fontSize="12px" mr={2}>
          <Text
            data-id="030925-76d6c5"
            fontWeight="700"
            noOfLines={1}
            textOverflow="ellipsis">
            {documentName}
          </Text>
          <Flex data-id="030925-10e534" opacity="0.6">Uploading ...</Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default DocumentUploading;
