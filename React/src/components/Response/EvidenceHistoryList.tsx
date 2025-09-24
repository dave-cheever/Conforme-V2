import { Flex } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { isPermitted } from '../can';
import DocumentUploaded from '../Documents/DocumentUploaded';

function EvidenceHistoryList() {
  const { user } = useAppContext();
  const { response, snapshot } = useResponseContext();
  return (
    <Flex data-id="000257" direction="column" maxW="342px">
      {response?.evidence.length > 0 && (
        <Flex data-id="000258" fontSize="11px" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      )}
      {response.evidence
        .filter(({ uploaded }) => uploaded?.id)
        .map((evidence, i) => (
          <Flex data-id="000259" flexDir="column" key={i} mb={3}>
            <DocumentUploaded
              data-id="000260"
              document={evidence.uploaded}
              downloadable={isPermitted({
                user,
                action: 'responses.view',
                data: response,
              })}
              removable={
                !snapshot &&
                isPermitted({
                  user,
                  action: 'responses.edit',
                  data: response,
                })
              } />
          </Flex>
        ))}
    </Flex>
  );
}

export default EvidenceHistoryList;
