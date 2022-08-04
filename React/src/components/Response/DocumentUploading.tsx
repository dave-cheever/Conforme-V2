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
    fontWeight="400"
    h="65px"
    justify="space-between"
    key={documentName}
    maxWidth={['none', 'none', 400]}
    role="group"
    w="full"
  >
    <Flex align="center">
      <Box bg="evidence.uploadBg" flexShrink={0} fontSize="12px" h="55px" ml="5px" mr={2} rounded="md" w="55px">
        <Flex align="center" h="full" justify="center">
          <Loader center size="lg" />
        </Flex>
      </Box>
      <Flex direction="column" fontSize="12px" mr={2} width={[150, 250, 250]}>
        <Text fontWeight="700" isTruncated textOverflow="ellipsis">
          {documentName}
        </Text>
        <Flex opacity="0.6">Uploading ...</Flex>
      </Flex>
      <Spacer />
    </Flex>
    <Flex align="center" mr={3}>
      <Tooltip label="Cancel upload">
        <Close cursor="pointer" h="15px" onClick={cancelUpload} stroke="#282F36" w="15px" />
      </Tooltip>
    </Flex>
  </Flex>
);

export default DocumentUploading;
