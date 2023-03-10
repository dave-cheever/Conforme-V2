import React from 'react';

import { Box } from '@chakra-ui/react';

import useResponseUtils from '../../hooks/useResponseUtils';

const ResponseStatusBox = ({ status }) => {
  const { responseStatuses } = useResponseUtils();
  return (
    (<Box
      alignSelf="flex-start"
      bg={`brand.${status}`}
      borderRadius="7px"
      color="white"
      data-id="594df38a5149"
      fontSize="sm"
      fontWeight="medium"
      m="0.75rem 0 -0.25rem 0"
      p="22px"
      zIndex={4}>
      {responseStatuses[status]}
    </Box>)
  );
};

export default ResponseStatusBox;
