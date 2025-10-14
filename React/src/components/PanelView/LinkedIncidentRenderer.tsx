import React from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { LinkedIncidentIcon, LinkedItemLinkIcon } from '../../icons';

interface LinkedIncidentRendererProps {
  readonly value: string;
}

function LinkedIncidentRenderer({ value }: LinkedIncidentRendererProps) {
  if (!value) return null;

  return (
    <Box data-id="002362" display="flex" flexDirection="column" gap={2}>
      <Flex
        alignItems="flex-start"
        backgroundColor="#F7FAFC"
        border="1px solid #E2E8F0"
        borderRadius="6px"
        data-id="linked-header"
        display="flex"
        flexDirection="column"
        gap="6px"
        justifyContent="flex-start"
        mb={2}
        px={3}
        py={2}
      >
        {/* Linked incident content */}
        <Box
          alignItems="center"
          data-id="002363"
          display="flex"
          gap={1}
          justifyContent="center">
          <LinkedIncidentIcon data-id="002364" />
          <Text color="#4A5568" data-id="002365" fontSize="12px" fontWeight="600">
            Linked Incident
          </Text>
        </Box>

        <Flex
          alignItems="center"
          data-id="002366"
          display="flex"
          gap={'4px'}
          justifyContent="center">
          <Text color="#3182CE" data-id="linked-value" fontSize="14px" fontWeight="600">
            {value}
          </Text>
          <LinkedItemLinkIcon data-id="002367" />
        </Flex>

      </Flex>
    </Box>
  );
}

export default LinkedIncidentRenderer;
