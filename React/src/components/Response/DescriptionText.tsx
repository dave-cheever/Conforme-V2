import { Box, Text } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';

const DescriptionText = () => {
  const { response } = useResponseContext();

  if (!response?.trackerItem?.description) return null;
  return (
    <Box color="trackerItemResponse.textColor" fontSize="14px" lineHeight="20px" mt="5" w="full" whiteSpace="break-spaces">
      <Text isTruncated>{response.trackerItem.description}</Text>
    </Box>
  );
};

export default DescriptionText;
