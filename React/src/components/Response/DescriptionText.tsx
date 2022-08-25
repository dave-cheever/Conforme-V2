import { Box } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';

const DescriptionText = () => {
  const { response } = useResponseContext();

  if (!response?.trackerItem?.description) return null;
  return (
    <Box color="trackerItemResponse.textColor" fontSize="14px" lineHeight="20px" mt="5" whiteSpace="break-spaces">
      {response.trackerItem.description}
    </Box>
  );
};

export default DescriptionText;
