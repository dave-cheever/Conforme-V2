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
    (<VStack
      align={['center', 'flex-start']}
      data-id="ff502b562032"
      spacing={4}
      w="full">
      {response?.trackerItem?.evidenceItems?.length > 0 && (
        <Flex data-id="74e341d83883" flexDirection="column" h="full" w="full">
          <Text data-id="211d4d4ae79a" fontSize={["14px", "sm"]} fontWeight="medium">
            Evidence expected
          </Text>
          <Text data-id="5c39bef6ad19" fontSize={["14px", "sm"]} my={1}>
            Upload all expected evidence and complete any required question to record this {t('tracker item')} as complete.
          </Text>
          <Stack
            align={['center', 'flex-start']}
            data-id="82651328d7f8"
            spacing={4}
            w="full">
            {response?.evidence.map((evidence, i) => (
              <Evidence data-id="66679a54914b" evidence={evidence} key={i} />
            ))}
          </Stack>
        </Flex>
      )}
      {response.trackerItem?.allowAttachments && (
        <Stack data-id="b406dc5a324f" justify={['center', 'flex-start']} w="full">
          <Stack data-id="696c9746c473" maxW="380px">
            <Text data-id="03291013c1b6" fontSize={["14px", "11px"]} fontWeight="700" mb={2}>
              Attachments
            </Text>
            {!snapshot && (
              <Can
                action="responses.edit"
                data={{ response }}
                data-id="aca89066aa99"
                // eslint-disable-next-line react/no-unstable-nested-components
                yes={() => (
                  <DocumentUpload
                    callback={async (uploaded) => {
                      await uploadAttachments(uploaded);
                      refetch();
                    }}
                    data-id="6d1aa22ba61c"
                    documentName="attachment"
                    elementId={response._id} />
                )} />
            )}
          </Stack>

          {response.attachments.length > 0 && (
            <Flex data-id="b41a1355f7a6" fontSize={["14px", "11px"]} fontWeight="bold" my={2}>
              Uploaded attachments
            </Flex>
          )}

          {response.attachments?.map((attachment, i) => (
            <Flex data-id="7614def5d85e" flexDir="column" key={i} maxW="380px" mb={2}>
              <DocumentUploaded
                callback={async () => {
                  await removeAttachment(attachment);
                  refetch();
                }}
                data-id="7619b3f80b56"
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
    </VStack>)
  );
}

export default Attachments;
