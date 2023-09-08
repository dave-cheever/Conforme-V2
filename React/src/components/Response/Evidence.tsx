import React, { useMemo, useState } from 'react';
import Dropzone, { Accept, FileRejection } from 'react-dropzone';

import { gql, useMutation } from '@apollo/client';
import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
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
  const acceptedFileTypes = useMemo<Accept>(
    () => ({
      'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.pptx', '.ppt', '.msg', '.zip'],
      'images/*': [],
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
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/files/document`, documentsData);
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
    (<Flex data-id="0d5c528d84eb" direction="column" maxW="342px" w="full">
      <Flex align="center" data-id="6e91afd5e51b" mb={2} mt={3}>
        <Box
          color="evidence.fontColor"
          data-id="4fb4efb625df"
          fontSize={11}
          fontWeight="700"
          lineHeight="16px"
          width="300px">
          {evidence.name}
          <Asterisk
            data-id="c39305b5b189"
            fill="questionListElement.iconAsterisk"
            h="9px"
            mb="5px"
            ml="5px"
            stroke="datepicker.iconAsterisk"
            w="9px" />
        </Box>
      </Flex>
      {evidence.uploaded?.id ? (
        <Flex data-id="061248b5300b" maxW="380px">
          <DocumentUploaded
            callback={async () => {
              await removeEvidence();
              refetch();
            }}
            data-id="2d643e8628fe"
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
        <DocumentUploading data-id="a1d5a531fba0" documentName={evidence.name} />
      ) : (
        <Can
          action="responses.edit"
          data={{ response }}
          data-id="1038a8ac89ea"
          // eslint-disable-next-line react/no-unstable-nested-components
          yes={() => (
            <Dropzone
              accept={acceptedFileTypes}
              data-id="9e35d7c7db33"
              multiple={false}
              onDrop={(acceptedFiles, rejectedFiles) =>
                upload({
                  acceptedFile: acceptedFiles[0],
                  rejectedFile: rejectedFiles[0],
                })
              }>
              {({ getRootProps, getInputProps }) => (
                <Box
                  data-id="4536a61bbaa6"
                  {...getRootProps()}
                  cursor="pointer"
                  h="65px"
                  maxW="380px"
                  w="full">
                  <input data-id="0665df7712c8" {...getInputProps()} />
                  <Flex
                    align="center"
                    borderColor="evidence.uploadBorderColor"
                    borderRadius="10px"
                    borderStyle="dashed"
                    borderWidth="1px"
                    color="evidence.uploadFontColor"
                    data-id="972d58bd12ed"
                    fontSize="14px"
                    h="full"
                    justify="space-between"
                    px={5}
                    w="full">
                    <Flex data-id="d859d9e75d6b">
                      {' '}
                      Drag and drop or{' '}
                      <Text color="evidence.browseFontColor" data-id="d08ec7b7692d" ml={1}>
                        {' '}
                        browse
                      </Text>
                    </Flex>
                    <UploadIcon data-id="60d55d3da3b6" h="21px" w="21px" />
                  </Flex>
                </Box>
              )}
            </Dropzone>
          )} />
      )}
      {status === 'rejected' && (
        <Flex
          color="red.500"
          data-id="22eb7abc30ce"
          fontSize="12px"
          fontWeight="bold"
          mt={2}>
          Document not uploaded. Accepted file types include {listSupportedFileTypes(acceptedFileTypes)}.
        </Flex>
      )}
    </Flex>)
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
