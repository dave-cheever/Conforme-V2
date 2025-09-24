import React, { useMemo, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

import { gql, useMutation } from '@apollo/client';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { runtimeEnv } from '../../utils/runtime-env';
import { t } from 'i18next';

import { toastFailed } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { Asterisk, UploadIcon } from '../../icons';
import { listSupportedFileTypes } from '../../utils/helpers';
import Can, { isPermitted } from '../can';
import DocumentUploaded from '../Documents/DocumentUploaded';
import DocumentUploading from './DocumentUploading';

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

function EvidenceExpected({ evidence }) {
  const toast = useToast();
  const { user } = useAppContext();
  const { response, snapshot, refetch } = useResponseContext();
  const acceptedFileTypes = useMemo<{[mimeType: string]: string[] }>(
    () => ({
      'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.pptx', '.ppt', '.msg', '.zip'],
      'image/*': [],
      'text/*': ['.txt', '.html'],
    }),
    [],
  );
  const [status, setStatus] = useState<'idle' | 'uploading' | 'rejected'>('idle');
  const [saveEvidence] = useMutation(ADD_DOCUMENTS);
  const [removeDocument] = useMutation(REMOVE_DOCUMENT);
  const removeEvidence = async () => {
    await removeDocument({
      variables: {
        responseDocumentRemoveInput: {
          _id: response?._id,
          documentId: evidence.uploaded.id,
          documentType: 'evidence',
        },
      },
    });
  };

  const upload = async ({ acceptedFile, rejectedFile }: { acceptedFile: File; rejectedFile: FileRejection }) => {
    if (!response) return;

    if (rejectedFile) setStatus('rejected');
    else {
      setStatus('uploading');
      try {
        const documentsData = new FormData();
        documentsData.append('elementId', response._id);
        documentsData.append('documentName', evidence.name);
        documentsData.append('documentType', 'evidence');
        documentsData.append('document', acceptedFile);
        const res = await axios.post(`${runtimeEnv.apiUrl()}/files/document`, documentsData);
        await saveEvidence({
          variables: {
            responseDocumentsAddInput: {
              _id: response?._id,
              documentType: 'evidence',
              documentName: evidence.name,
              uploaded: res.data,
            },
          },
        });
        refetch();
      } catch (error) {
        toast({
          ...toastFailed,
          title: 'Failed',
          description: 'Failed to upload document',
        });
      } finally {
        setStatus('idle');
      }
    }
  };

  if (!response) return null;

  return (
    <Flex data-id="000261" direction="column" maxW="342px" w="full">
      <Flex data-id="000262" align="center" mb={2} mt={3}>
        <Box
          data-id="000263"
          color="evidence.fontColor"
           fontSize={["14px", "11px"]}
          fontWeight="700"
          lineHeight="16px"
          width="300px">
          {evidence.name}
          <Asterisk
            data-id="000264"
            fill="questionListElement.iconAsterisk"
            h="9px"
            mb="5px"
            ml="5px"
            stroke="datepicker.iconAsterisk"
            w="9px" />
        </Box>
      </Flex>
      {evidence.uploaded?.id ? (
        <Flex data-id="000265" maxW="380px">
          <DocumentUploaded
            data-id="000266"
            callback={async () => {
              await removeEvidence();
              refetch();
            }}
            deleteModalMessage={`Are you sure you wish to delete ${evidence.uploaded.name
              }? It will reset the status for the last iteration to ${t('non-compliant')}.`}
            document={evidence.uploaded}
            downloadable={isPermitted({
              user,
              action: 'responses.view',
              data: { response },
            })}
            removable={
              !snapshot &&
              !evidence.outdated &&
              isPermitted({
                user,
                action: 'responses.edit',
                data: { response },
              })
            } />
        </Flex>
      ) : status === 'uploading' ? (
        <DocumentUploading data-id="000267" documentName={evidence.name} />
      ) : (
        <Can
          data-id="000268"
          action="responses.edit"
          data={{ response }}
          // eslint-disable-next-line react/no-unstable-nested-components
          yes={() => (
            <Dropzone
              data-id="000269"
              accept={acceptedFileTypes}
              multiple={false}
              onDrop={(acceptedFiles, rejectedFiles) =>
                upload({
                  acceptedFile: acceptedFiles[0],
                  rejectedFile: rejectedFiles[0],
                })
              }>
              {({ getRootProps, getInputProps }) => (
                <Box
                  data-id="000270"
                  {...getRootProps()}
                  cursor="pointer"
                  h="65px"
                  maxW="380px"
                  w="full">
                  <input data-id="000271" {...getInputProps()} />
                  <Flex
                    data-id="000272"
                    align="center"
                    bg="#F7FAFC"
                    borderColor="evidence.uploadBorderColor"
                    borderRadius="10px"
                    borderStyle="dashed"
                    borderWidth="1px"
                    color="evidence.uploadFontColor"
                    fontSize="14px"
                    h="full"
                    justify="space-between"
                    px={5}
                    w="full">
                    <Flex data-id="000273">
                      {' '}
                      Drag and drop or{' '}
                      <Text data-id="000274" color="evidence.browseFontColor" ml={1}>
                        {' '}
                        browse
                      </Text>
                    </Flex>
                    <UploadIcon data-id="000275" h="21px" w="21px" />
                  </Flex>
                </Box>
              )}
            </Dropzone>
          )} />
      )}
      {status === 'rejected' && (
        <Flex
          data-id="000276"
          color="red.500"
          fontSize="12px"
          fontWeight="bold"
          mt={2}>
          Document not uploaded. Accepted file types include {listSupportedFileTypes(acceptedFileTypes)}.
        </Flex>
      )}
    </Flex>
  );
}

export default EvidenceExpected;

export const evidenceStyles = {
  evidence: {
    fontColor: '#1F1F1F',
    requiredColor: '#E93C44',
    borderColor: '#D9D9E0',
    uploadFontColor: '#818197',
    uploadBorderColor: '#D9D9E0',
    browseFontColor: '#462AC4',
    uploadBg: '#FFFFFF',
  },
};
