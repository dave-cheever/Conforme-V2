import { Box, Flex, Spacer, Text, Tooltip } from '@chakra-ui/react';

import { Close } from '../../icons';
import Loader from '../Loader';

const DocumentUploading = ({ documentName, cancelUpload }: { documentName: string; cancelUpload?: () => void }) => (
  <Flex
    align="center"
    borderColor="evidence.uploadBorderColor"
    borderRadius="10px"
    borderStyle="dashed"
    borderWidth="1px"
    color="brand.darkGrey"
    data-id="6198fde4ec05"
    fontWeight="400"
    h="65px"
    justify="space-between"
    key={documentName}
    maxWidth={['none', 'none', 400]}
    role="group"
    w="full">
    <Flex align="center" data-id="d68529c55117" w='80%'>
      <Box
        bg="evidence.uploadBg"
        data-id="bb0ff4534b85"
        flexShrink={0}
        fontSize="12px"
        h="55px"
        ml="5px"
        mr={2}
        rounded="md"
        w="55px">
        <Flex align="center" data-id="73f3cb028796" h="full" justify="center">
          <Loader center data-id="51973b4c07cb" size="lg" />
        </Flex>
      </Box>
      <Flex
        data-id="5ca9d084d7fc"
        direction="column"
        fontSize="12px"
        mr={2}
        width={[150, 250, 250]}>
        <Text
          data-id="ef7f68aacdcb"
          fontWeight="700"
          isTruncated
          textOverflow="ellipsis">
          {documentName}
        </Text>
        <Flex data-id="5876385d4365" opacity="0.6">Uploading ...</Flex>
      </Flex>
      <Spacer data-id="5fd7ed7d4e49" />
    </Flex>
    <Flex align="center" data-id="a5144c57ec6c" mr={3}>
      <Tooltip data-id="702ebad322d7" label="Cancel upload">
        <Close
          cursor="pointer"
          data-id="cfd8e7812914"
          h="15px"
          onClick={cancelUpload}
          stroke="#282F36"
          w="15px" />
      </Tooltip>
    </Flex>
  </Flex>
);

export default DocumentUploading;
