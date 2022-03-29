import React from 'react';

import { Box } from '@chakra-ui/react';

import { responseStatuses } from '../../hooks/useResponseUtils';

const ResponseStatusBox = ({ status }) => (
  <Box
    alignSelf="flex-start"
    bg={`brand.${status}`}
    borderRadius="7px"
    color="white"
    fontSize="sm"
    fontWeight="medium"
    m="0.75rem 0 -0.25rem 0"
    p="22px"
    zIndex={4}
  >
    {responseStatuses[status]}
  </Box>
);

export default ResponseStatusBox;
