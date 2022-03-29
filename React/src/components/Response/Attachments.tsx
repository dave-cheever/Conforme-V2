import React from 'react';

import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';
import Attachment from './Attachment';
import Evidence from './Evidence';
import EvidenceHistoryList from './EvidenceHistoryList';

const Attachments = () => {
  const { response } = useResponseContext();

  return (
    <Flex
      align={['center', 'flex-start']}
      flexDirection={['column', 'row']}
      h="full"
      overflow={['visible', 'auto']}
      w="full"
    >
      <Flex flexDirection="column" h="full" mr={[0, 2]} w="full">
        <Text fontSize="sm" fontWeight="medium">
          Evidence Expected{' '}
          <Box as="span" color="red">
            (required)
          </Box>
        </Text>
        <Text fontSize="sm" my={1}>
          Upload all expected evidence and complete any required question to
          record this compliance item as complete.
        </Text>
        <Stack align={['center', 'flex-start']} spacing={4} w="full">
          {response?.evidence
            .filter(({ outdated }) => !outdated)
            .map((evidence, i) => (
              <Evidence evidence={evidence} key={i} />
            ))}
          <EvidenceHistoryList />
        </Stack>
      </Flex>
      <Flex h="full" justify={['center', 'flex-start']} ml={[0, 2]} w="full">
        <Attachment />
      </Flex>
    </Flex>
  );
};

export default Attachments;
