import { useRef, useState } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';

import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

import { toastFailed } from '../../bootstrap/config';
import UploadIcon from '../../icons/UploadIcon';
import { listSupportedFileTypes } from '../../utils/helpers';
import { runtimeEnv } from '../../utils/runtime-env';
import DocumentUploading from '../Response/DocumentUploading';

const defaultFileTypes = {
  'application/*': ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.pptx', '.ppt', '.msg', '.zip'],
  'image/*': [],
  'text/*': ['.txt', '.html'],
};

function DocumentUpload({
  elementId,
  documentName,
  callback,
  setUploadStatus,
  disabled = false,
  doNotAwaitCallback,
  acceptedFileTypes = defaultFileTypes,
}: {
  disabled?: boolean;
  elementId: string;
  documentName?: string;
  callback?: (
    uploaded: {
      name: string;
      id: string;
      addedAt: Date;
    }[],
  ) => Promise<void>;
  setUploadStatus?: (uploading: boolean) => void;
  doNotAwaitCallback?: boolean;
  acceptedFileTypes?: { [mimeType: string]: string[] };
}) {
  const toast = useToast();
  const uploadControllerRef = useRef<{ [key: string]: AbortController }>({});
  const [rejected, setRejected] = useState<boolean>(false);
  const [uploading, setUploading] = useState<string[]>([]);

  const upload = async ({ acceptedFiles, rejectedFiles }: { acceptedFiles: File[]; rejectedFiles: FileRejection[] }) => {
    if (rejectedFiles?.length > 0) setRejected(true);
    else {
      const acceptedFilesNames = acceptedFiles.map((file) => file.name);
      setUploading((uploading) => [...uploading, ...acceptedFilesNames]);
      if (setUploadStatus) setUploadStatus(true);
      acceptedFiles.forEach(async (file) => {
        uploadControllerRef.current[file.name] = new AbortController();
        try {
          const documentsData = new FormData();
          documentsData.append('elementId', elementId);
          if (documentName) documentsData.append('documentName', documentName);
          documentsData.append('document', file);
          const res = await axios.post(`${runtimeEnv.apiUrl()}/files/document`, documentsData, {
            signal: uploadControllerRef.current[file.name].signal,
          });
          if (callback) {
            if (doNotAwaitCallback) callback(res.data);
            else await callback(res.data);
          }
        } catch (error: any) {
          if (error?.message !== 'canceled') {
            toast({
              ...toastFailed,
              title: 'Failed',
              description: 'Failed to upload document',
            });
          }
        } finally {
          setUploading((uploading) => uploading.filter((name) => name !== file.name));
          if (setUploadStatus) setUploadStatus(false);
        }
      });
    }
  };

  return (
    <Flex data-id="000504" flexDirection="column" fontWeight="700" w="full">
      {uploading.length > 0 ? (
        uploading.map((name) => (
          <Flex data-id="000505" key={name} mb={3}>
            <DocumentUploading
              cancelUpload={() => {
                uploadControllerRef.current[name].abort();
                delete uploadControllerRef.current[name];
              }}
              data-id="000506"
              documentName={name} />
          </Flex>
        ))
      ) : (
        <Dropzone
          accept={acceptedFileTypes}
          data-id="000507"
          disabled={disabled}
          multiple
          onDrop={(acceptedFiles, rejectedFiles) => upload({ acceptedFiles, rejectedFiles })}>
          {({ getRootProps, getInputProps }) => (
            <Box
              data-id="000508"
              {...getRootProps()}
              cursor="pointer"
              h="65px"
              mb={3}
              w="full">
              <input data-id="000509" {...getInputProps()} />
              <Flex
                align="center"
                bg="#F7FAFC"
                borderColor="#D9D9E0"
                borderRadius="10px"
                borderStyle="dashed"
                borderWidth="1px"
                color="#818197"
                data-id="000510"
                fontSize="14px"
                fontWeight="semi_medium"
                h="full"
                justify="space-between"
                px={5}
                w="full">
                <Flex data-id="000511">
                  {' '}
                  Drag and drop or{' '}
                  <Text color="#462AC4" data-id="000512" ml={1}>
                    {' '}
                    browse
                  </Text>
                </Flex>
                <UploadIcon color="#818197" data-id="000513" h="21px" w="21px" />
              </Flex>
            </Box>
          )}
        </Dropzone>
      )}
      {rejected && (
        <Flex
          color="red.500"
          data-id="000514"
          fontSize="12px"
          fontWeight="bold"
          mt={2}>
          Document not uploaded. Accepted file types include {listSupportedFileTypes(acceptedFileTypes)}
        </Flex>
      )}
    </Flex>
  );
}

export default DocumentUpload;
