import { Box, Flex, Spacer, Text, Tooltip } from '@chakra-ui/react';

import { Close } from '../../icons';
import Loader from '../Loader';

function DocumentUploading({ documentName, cancelUpload }: { documentName: string; cancelUpload?: () => void }) {
  return (
    <Flex
      data-id="000244"
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
      maxWidth={['none', 'none', 400]}
      role="group"
      w="full">
      <Flex data-id="000245" align="center" w='80%'>
        <Box
          data-id="000246"
          bg="evidence.uploadBg"
          flexShrink={0}
          fontSize="12px"
          h="55px"
          ml="5px"
          mr={2}
          rounded="md"
          w="55px">
          <Flex data-id="000247" align="center" h="full" justify="center">
            <Loader data-id="000248" center size="lg" />
          </Flex>
        </Box>
        <Flex
          data-id="000249"
          direction="column"
          fontSize="12px"
          mr={2}
          width={[150, 250, 250]}>
          <Text
            data-id="000250"
            fontWeight="700"
            noOfLines={1}
            textOverflow="ellipsis">
            {documentName}
          </Text>
          <Flex data-id="000251" opacity="0.6">Uploading ...</Flex>
        </Flex>
        <Spacer data-id="000252" />
      </Flex>
      <Flex data-id="000253" align="center" mr={3}>
        <Tooltip data-id="000254" label="Cancel upload">
          <Close
            data-id="000255"
            cursor="pointer"
            h="15px"
            onClick={cancelUpload}
            stroke="#282F36"
            w="15px" />
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default DocumentUploading;
