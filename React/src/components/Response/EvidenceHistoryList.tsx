import { Flex } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { isPermitted } from '../can';
import DocumentUploaded from '../Documents/DocumentUploaded';

function EvidenceHistoryList() {
  const { user } = useAppContext();
  const { response, snapshot } = useResponseContext();
  return (
    (<Flex data-id="87a663d4149c" direction="column" maxW="342px">
      {response?.evidence.length > 0 && (
        <Flex data-id="8201ae36a0b6" fontSize="11px" fontWeight="bold" my={3}>
          Evidence history
        </Flex>
      )}
      {response.evidence
        .filter(({ uploaded }) => uploaded?.id)
        .map((evidence, i) => (
          <Flex data-id="bdc3bfd9eff7" flexDir="column" key={i} mb={3}>
            <DocumentUploaded
              data-id="23096350c4fd"
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
    </Flex>)
  );
}

export default EvidenceHistoryList;
