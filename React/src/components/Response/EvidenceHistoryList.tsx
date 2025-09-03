import { Flex } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { isPermitted } from '../can';
import DocumentUploaded from '../Documents/DocumentUploaded';

function EvidenceHistoryList() {
  const { user } = useAppContext();
  const { response, snapshot } = useResponseContext();
  return (
    <Flex data-id="030925-91135b" direction="column" maxW="342px">
      {response?.evidence.length > 0 && (
        <Flex data-id="030925-2636b1" fontSize="11px" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      )}
      {response.evidence
        .filter(({ uploaded }) => uploaded?.id)
        .map((evidence, i) => (
          <Flex data-id="030925-8fcb06" flexDir="column" key={i} mb={3}>
            <DocumentUploaded
              data-id="030925-77b553"
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
