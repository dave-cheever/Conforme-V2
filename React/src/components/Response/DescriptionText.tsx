import { Box, Text } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';

const DescriptionText = () => {
  const { response } = useResponseContext();

  if (!response?.trackerItem?.description) return null;
  return (
    (<Box
      color="trackerItemResponse.textColor"
      data-id="f170f63eff96"
      fontSize="14px"
      lineHeight="20px"
      mt="5"
      w="full"
      whiteSpace="break-spaces">
      <Text data-id="877d4b58403a" isTruncated>{response.trackerItem.description}</Text>
    </Box>)
  );
};

export default DescriptionText;
