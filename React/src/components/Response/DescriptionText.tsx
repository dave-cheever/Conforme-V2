import { Box } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';

const DescriptionText = () => {
  const { response } = useResponseContext();

  if (!response?.complianceItem?.description) return null;
  return (
    <Box color="complianceItemResponse.textColor" fontSize="14px" lineHeight="20px" mt="5" whiteSpace="break-spaces">
      {response.complianceItem.description}
    </Box>
  );
};

export default DescriptionText;
