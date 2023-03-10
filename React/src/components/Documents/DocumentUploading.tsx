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
    data-id="5eb6e2f2ab8a"
    fontWeight="400"
    h="65px"
    justify="space-between"
    key={documentName}
    role="group"
    w="full">
    <Flex align="center" data-id="458a4b103d60">
      <Box
        bg="evidence.uploadBg"
        data-id="3cadfab088bc"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        ml="5px"
        mr={2}
        rounded="md"
        w="55px">
        <Flex align="center" data-id="59914c1afd4a" h="full" justify="center">
          <Loader center data-id="b4c21dd2b3d3" size="lg" />
        </Flex>
      </Box>
      <Flex data-id="78976e34c4ce" direction="column" fontSize="12px" mr={2}>
        <Text
          data-id="b0ce346dceee"
          fontWeight="700"
          noOfLines={1}
          textOverflow="ellipsis">
          {documentName}
        </Text>
        <Flex data-id="631eea005dbc" opacity="0.6">Uploading ...</Flex>
      </Flex>
    </Flex>
  </Flex>
);

export default DocumentUploading;
