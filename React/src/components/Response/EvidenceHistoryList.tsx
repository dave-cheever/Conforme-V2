import { Flex } from '@chakra-ui/react';

import { useResponseContext } from '../../contexts/ResponseProvider';
import DocumentUploaded from './DocumentUploaded';

const EvidenceHistoryList = () => {
  const { response } = useResponseContext();
  return (
    <Flex direction="column" maxW="342px">
      {response?.evidence?.filter(({ outdated }) => outdated).length > 0 && (
        <Flex fontSize="11px" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      )}

      {response.evidence
        ?.filter(({ outdated }) => outdated)
        .filter(({ uploaded }) => uploaded?.id)
        .map((evidence, i) => (
          <Flex flexDir="column" key={i} mb={3}>
            <DocumentUploaded
              document={evidence.uploaded}
              isEvidence
              outDated
            />
          </Flex>
        ))}
    </Flex>
  );
};

export default EvidenceHistoryList;
