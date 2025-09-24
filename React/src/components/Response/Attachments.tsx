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
        data-id="000230"
        align={['center', 'flex-start']}
        spacing={4}
        w="full">
      {response?.trackerItem?.evidenceItems?.length > 0 && (
        <Flex data-id="000231" flexDirection="column" h="full" w="full">
          <Text data-id="000232" fontSize={["14px", "sm"]} fontWeight="medium">
            Evidence expected
          </Text>
          <Text data-id="000233" fontSize={["14px", "sm"]} my={1}>
            Upload all expected evidence and complete any required question to record this {t('tracker item')} as complete.
          </Text>
          <Stack
            data-id="000234"
            align={['center', 'flex-start']}
            spacing={4}
            w="full">
            {response?.evidence.map((evidence, i) => (
              <Evidence data-id="000235" evidence={evidence} key={i} />
            ))}
          </Stack>
        </Flex>
      )}
      {response.trackerItem?.allowAttachments && (
        <Stack data-id="000236" justify={['center', 'flex-start']} w="full">
          <Stack data-id="000237" maxW="380px">
            <Text data-id="000238" fontSize={["14px", "11px"]} fontWeight="700" mb={2}>
              Attachments
            </Text>
            {!snapshot && (
              <Can
                data-id="000239"
                action="responses.edit"
                data={{ response }}
                // eslint-disable-next-line react/no-unstable-nested-components
                yes={() => (
                  <DocumentUpload
                    data-id="000240"
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
            <Flex data-id="000241" fontSize={["14px", "11px"]} fontWeight="bold" my={2}>
              Uploaded attachments
            </Flex>
          )}

          {response.attachments?.map((attachment, i) => (
            <Flex data-id="000242" flexDir="column" key={i} maxW="380px" mb={2}>
              <DocumentUploaded
                data-id="000243"
                callback={async () => {
                  await removeAttachment(attachment);
                  refetch();
                }}
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
