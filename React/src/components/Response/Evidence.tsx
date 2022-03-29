import React, { useMemo, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

import { toastFailed } from '../../bootstrap/config';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { Asterisk, UploadIcon } from '../../icons';
import Can from '../can';
import DocumentUploaded from './DocumentUploaded';
import DocumentUploading from './DocumentUploading';

const EvidenceExpected = ({ evidence }) => {
  const toast = useToast();
  const { response, refetch } = useResponseContext();
  const acceptedFileTypes = useMemo(
    () => [
      '.pdf',
      '.doc',
      '.docx',
      '.xls',
      '.xlsx',
      '.txt',
      'image/*',
      '.zip',
      '.html',
      '.pptx',
      '.ppt',
      '.msg',
    ],
    [],
  );
  const [status, setStatus] = useState<'idle' | 'uploading' | 'rejected'>(
    'idle',
  );

  const upload = async ({
    acceptedFile,
    rejectedFile,
  }: {
    acceptedFile: File;
    rejectedFile: FileRejection;
  }) => {
    if (!response) return;

    if (rejectedFile) setStatus('rejected');
    else {
      setStatus('uploading');
      try {
        const documentsData = new FormData();
        documentsData.append('responseId', response._id);
        documentsData.append('documentName', evidence.name);
        documentsData.append('documentType', 'evidence');
        documentsData.append('document', acceptedFile);
        await axios.post(
          `${process.env.REACT_APP_API_URL}/files/document`,
          documentsData,
        );
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
    <Flex direction="column" maxW="342px" w="full">
      <Flex align="center" mb={2} mt={3}>
        <Box
          color="evidence.fontColor"
          fontSize={11}
          fontWeight="700"
          lineHeight="16px"
          width="300px"
        >
          {evidence.name}
          <Asterisk
            fill="questionListElement.iconAsterisk"
            h="9px"
            mb="5px"
            ml="5px"
            stroke="datepicker.iconAsterisk"
            w="9px"
          />
        </Box>
      </Flex>
      {evidence.uploaded?.id ? (
        <DocumentUploaded document={evidence.uploaded} isEvidence />
      ) : status === 'uploading' ? (
        <DocumentUploading documentName={evidence.name} />
      ) : (
        <Can
          action="responses.edit"
          data={{ response }}
          yes={() => (
            <Dropzone
              accept={acceptedFileTypes}
              multiple={false}
              onDrop={(acceptedFiles, rejectedFiles) =>
                upload({
                  acceptedFile: acceptedFiles[0],
                  rejectedFile: rejectedFiles[0],
                })
              }
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  align="center"
                  cursor="pointer"
                  h="65px"
                  w="full"
                >
                  <input {...getInputProps()} />
                  <Flex
                    align="center"
                    borderColor="evidence.uploadBorderColor"
                    borderRadius="10px"
                    borderStyle="dashed"
                    borderWidth="1px"
                    color="evidence.uploadFontColor"
                    fontSize="14px"
                    h="full"
                    justify="space-between"
                    px={5}
                    w="full"
                  >
                    <Flex>
                      {' '}
                      Drag and drop or{' '}
                      <Text color="evidence.browseFontColor" ml={1}>
                        {' '}
                        browse
                      </Text>
                    </Flex>
                    <UploadIcon h="21px" w="21px" />
                  </Flex>
                </Box>
              )}
            </Dropzone>
          )}
        />
      )}
      {status === 'rejected' && (
        <Flex color="red.500" fontSize="12px" fontWeight="bold" mt={2}>
          Document not uploaded. Accepted file types include{' '}
          {acceptedFileTypes.map((file) => `${file} `)}
        </Flex>
      )}
    </Flex>
  );
};

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
