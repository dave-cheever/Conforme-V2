import React from "react";
import {
  Box,
  Flex,
  Text
} from "@chakra-ui/react";

import Loader from "../Loader";

const DocumentUploading = ({ documentName }: { documentName: string }) => (
  <Flex
    key={documentName}
    w='full'
    h='65px'
    fontWeight='400'
    borderRadius="10px"
    maxWidth='400px'
    align='center'
    justify='space-between'
    color='brand.darkGrey'
    role="group"
    borderWidth="1px" borderStyle="dashed" borderColor="evidence.uploadBorderColor"
  >
    <Flex align='center'>
      <Box w='55px' h='55px' bg='evidence.uploadBg' rounded='md' ml='5px' mr={2} fontSize='12px' flexShrink={0} align='center'>
        <Flex align='center' justify='center' h='full'>
          <Loader center={true} size='lg' />
        </Flex>
      </Box>
      <Flex direction='column' fontSize='12px' mr={2}  width="250px">
        <Text fontWeight='700' noOfLines={1} textOverflow="ellipsis">{documentName}</Text>
        <Flex opacity='0.6'>Uploading ...</Flex>
      </Flex>
    </Flex>
  </Flex>
);


export default DocumentUploading;
