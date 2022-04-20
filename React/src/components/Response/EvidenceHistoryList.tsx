import { Flex } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { isPermitted } from '../can';
import DocumentUploaded from '../Documents/DocumentUploaded';

const EvidenceHistoryList = () => {
  const { user } = useAppContext();
  const { response, snapshot } = useResponseContext();
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
              downloadable={isPermitted({
                user,
                action: 'responses.edit',
                data: response,
              })}
              removable={
                !snapshot &&
                !evidence.outdated &&
                isPermitted({
                  user,
                  action: 'responses.edit',
                  data: response,
                })
              }
            />
          </Flex>
        ))}
    </Flex>
  );
};

export default EvidenceHistoryList;
