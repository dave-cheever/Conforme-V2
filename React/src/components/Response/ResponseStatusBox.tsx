import React from 'react';
import { Box } from '@chakra-ui/react';
import { responseStatuses } from '../../hooks/useResponseUtils';

const ResponseStatusBox = ({ status }) => {
  return (
    <Box
      p="22px"
      bg={`brand.${status}`}
      alignSelf='flex-start'
      borderRadius="7px"
      color="white"
      fontSize="sm"
      fontWeight="medium"
      m='0.75rem 0 -0.25rem 0'
      zIndex={4}
    >
      {responseStatuses[status]}
    </Box>
  );
};

export default ResponseStatusBox;
