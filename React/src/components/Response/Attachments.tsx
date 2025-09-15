import { gql, useMutation } from '@apollo/client';
import { Flex, Stack, Text, VStack } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import Can, { isPermitted } from '../can';
import DocumentUpload from '../Documents/DocumentUpload';
import DocumentUploaded from '../Documents/DocumentUploaded';
import Evidence from './Evidence';

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

function Attachments() {
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
    <VStack
        align={['center', 'flex-start']}
        data-id="030925-46b9ca"
        spacing={4}
        w="full">
      {response?.trackerItem?.evidenceItems?.length > 0 && (
        <Flex data-id="030925-2197d6" flexDirection="column" h="full" w="full">
          <Text data-id="030925-8b448b" fontSize={["14px", "sm"]} fontWeight="medium">
            Evidence expected
          </Text>
          <Text data-id="030925-e92636" fontSize={["14px", "sm"]} my={1}>
            Upload all expected evidence and complete any required question to record this {t('tracker item')} as complete.
          </Text>
          <Stack
            align={['center', 'flex-start']}
            data-id="030925-c2d49b"
            spacing={4}
            w="full">
            {response?.evidence.map((evidence, i) => (
              <Evidence data-id="030925-1c889f" evidence={evidence} key={i} />
            ))}
          </Stack>
        </Flex>
      )}
      {response.trackerItem?.allowAttachments && (
        <Stack data-id="030925-f457d5" justify={['center', 'flex-start']} w="full">
          <Stack data-id="030925-36a7d3" maxW="380px">
            <Text data-id="030925-59f2b0" fontSize={["14px", "11px"]} fontWeight="700" mb={2}>
              Attachments
            </Text>
            {!snapshot && (
              <Can
                action="responses.edit"
                data-id="030925-1c6e5d"
                data={{ response }}
                // eslint-disable-next-line react/no-unstable-nested-components
                yes={() => (
                  <DocumentUpload
                    data-id="030925-24bd5c"
                    callback={async (uploaded) => {
                      await uploadAttachments(uploaded);
                      refetch();
                    }}
                    documentName="attachment"
                    elementId={response._id} />
                )} />
            )}
          </Stack>

          {response.attachments.length > 0 && (
            <Flex data-id="030925-bcfbbe" fontSize={["14px", "11px"]} fontWeight="bold" my={2}>
              Uploaded attachments
            </Flex>
          )}

          {response.attachments?.map((attachment, i) => (
            <Flex data-id="030925-f12f8b" flexDir="column" key={i} maxW="380px" mb={2}>
              <DocumentUploaded
                callback={async () => {
                  await removeAttachment(attachment);
                  refetch();
                }}
                data-id="030925-9e6f75"
                document={attachment}
                downloadable={isPermitted({
                  user,
                  action: 'responses.view',
                  data: { response },
                })}
                removable={
                  !snapshot &&
                  isPermitted({
                    user,
                    action: 'responses.edit',
                    data: { response },
                  })
                } />
            </Flex>
          ))}
        </Stack>
      )}
    </VStack>
  );
}

export default Attachments;
