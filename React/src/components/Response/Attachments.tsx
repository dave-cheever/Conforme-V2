import { gql, useMutation } from '@apollo/client';
import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import Can, { isPermitted } from '../can';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import Evidence from './Evidence';
import EvidenceHistoryList from './EvidenceHistoryList';

const ADD_DOCUMENTS = gql`
  mutation ($responseDocumentsAddInput: ResponseDocumentsAddInput!) {
    addDocuments(responseDocumentsAddInput: $responseDocumentsAddInput)
  }
`;

const REMOVE_DOCUMENT = gql`
  mutation ($responseDocumentRemoveInput: ResponseDocumentRemoveInput!) {
    removeDocument(responseDocumentRemoveInput: $responseDocumentRemoveInput)
  }
`;

const Attachments = () => {
  const { user } = useAppContext();
  const { response, snapshot, refetch } = useResponseContext();

  const [addDocuments] = useMutation(ADD_DOCUMENTS);
  const uploadAttachments = async (uploaded) => {
    await addDocuments({
      variables: {
        responseDocumentsAddInput: {
          _id: response?._id,
          documentType: 'attachment',
          uploaded,
        },
      },
    });
  };

  const [removeDocument] = useMutation(REMOVE_DOCUMENT);
  const removeAttachment = async (document) => {
    await removeDocument({
      variables: {
        responseDocumentRemoveInput: {
          _id: response?._id,
          documentId: document?.id,
          documentType: 'attachment',
        },
      },
    });
  };

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
      <Stack h="full" justify={['center', 'flex-start']} ml={[0, 2]} w="full">
        <Stack maxW="380px">
          <Text fontSize="11px" fontWeight="700" mb={2}>
            Other attachments
          </Text>
          {!snapshot && (
            <Can
              action="responses.edit"
              data={{ response }}
              yes={() => (
                <DocumentUpload
                  callback={async (uploaded) => {
                    await uploadAttachments(uploaded);
                    refetch();
                  }}
                  documentName="attachment"
                  elementId={response._id}
                />
              )}
            />
          )}
        </Stack>

        <Stack>
          {response.attachments.length > 0 && (
            <Flex fontSize="11px" fontWeight="bold" my={2}>
              Uploaded attachments
            </Flex>
          )}

          {response.attachments?.map((attachment, i) => (
            <Flex flexDir="column" key={i} maxW="380px" mb={2}>
              <DocumentUploaded
                callback={async () => {
                  await removeAttachment(attachment);
                  refetch();
                }}
                document={attachment}
                downloadable={isPermitted({
                  user,
                  action: 'responses.edit',
                  data: response,
                })}
                removable={
                  !snapshot &&
                  isPermitted({
                    user,
                    action: 'responses.edit',
                    data: response,
                  })
                }
              />
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Attachments;
