import React, { useMemo, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

import { toastFailed } from '../../bootstrap/config';
import { useResponseContext } from '../../contexts/ResponseProvider';
import UploadIcon from '../../icons/UploadIcon';
import Can from '../can';
import DocumentUploaded from './DocumentUploaded';
import DocumentUploading from './DocumentUploading';

const Attachment = () => {
  const toast = useToast();
  const { response, snapshot, refetch } = useResponseContext();
  const [rejected, setRejected] = useState<boolean>(false);
  const [uploading, setUploading] = useState<string[]>([]);
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

  const upload = async ({
    acceptedFiles,
    rejectedFiles,
  }: {
    acceptedFiles: File[];
    rejectedFiles: FileRejection[];
  }) => {
    if (!response) return;

    if (rejectedFiles?.length > 0) setRejected(true);
    else {
      const acceptedFilesNames = acceptedFiles.map((file) => file.name);
      setUploading((uploading) => [...uploading, ...acceptedFilesNames]);
      try {
        const documentsData = new FormData();
        documentsData.append('responseId', response._id);
        documentsData.append('documentType', 'attachments');
        acceptedFiles.forEach((file) => documentsData.append('document', file));
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
        setUploading((uploading) =>
          uploading.filter((name) => !acceptedFilesNames.includes(name)),
        );
      }
    }
  };

  if (!response) return null;

  return (
    <Flex flexDirection="column" fontWeight="700" maxWidth="342px" w="full">
      <Flex fontSize="11px" mb={2}>
        Other attachments
      </Flex>
      {uploading.length > 0
        ? uploading.map((name) => (
            <Flex key={name} mb={3}>
              <DocumentUploading documentName={name} />
            </Flex>
          ))
        : !snapshot && (
            <Can
              action="responses.edit"
              data={{ response }}
              yes={() => (
                <Dropzone
                  accept={acceptedFileTypes}
                  multiple
                  onDrop={(acceptedFiles, rejectedFiles) =>
                    upload({ acceptedFiles, rejectedFiles })
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      cursor="pointer"
                      mb={3}
                      minH="65px"
                      w="full"
                    >
                      <input {...getInputProps()} />
                      <Flex
                        align="center"
                        borderColor="#D9D9E0"
                        borderRadius="10px"
                        borderStyle="dashed"
                        borderWidth="1px"
                        color="#818197"
                        fontSize="14px"
                        fontWeight="semi_medium"
                        h="full"
                        justify="space-between"
                        px={5}
                        w="full"
                      >
                        <Flex>
                          {' '}
                          Drag and drop or{' '}
                          <Text color="#462AC4" ml={1}>
                            {' '}
                            browse
                          </Text>
                        </Flex>
                        <UploadIcon color="#818197" h="21px" w="21px" />
                      </Flex>
                    </Box>
                  )}
                </Dropzone>
              )}
            />
          )}
      {rejected && (
        <Flex color="red.500" fontSize="12px" fontWeight="bold" mt={2}>
          Document not uploaded. Accepted file types include{' '}
          {acceptedFileTypes.map((file) => `${file} `)}
        </Flex>
      )}

      {response.attachments.length > 0 && (
        <Flex fontSize="11px" fontWeight="bold" my={2}>
          Uploaded attachments
        </Flex>
      )}

      {response.attachments?.map((attachment, i) => (
        <Flex flexDir="column" key={i} mb={2}>
          <DocumentUploaded document={attachment} isAttachment />
        </Flex>
      ))}
    </Flex>
  );
};

export default Attachment;
