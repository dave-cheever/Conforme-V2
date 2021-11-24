import React, { useMemo, useState } from 'react';
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { AttachmentIcon } from '@chakra-ui/icons';
import axios from 'axios';

import DocumentUploaded from './DocumentUploaded';
import DocumentUploading from './DocumentUploading';
import Can from '../can';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from '../../bootstrap/config';

const Attachments = () => {
  const toast = useToast();
  const {
    response,
    refetch,
  } = useResponseContext();
  const [rejected, setRejected] = useState<boolean>(false);
  const [uploading, setUploading] = useState<string[]>([]);
  const acceptedFileTypes = useMemo(() => ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', 'image/*', '.zip', '.html', '.pptx', '.ppt', '.msg'], []);

  const upload = async ({ acceptedFiles, rejectedFiles }: { acceptedFiles: File[]; rejectedFiles: FileRejection[]; }) => {
    if (!response) {
      return;
    }
    if (rejectedFiles?.length > 0) {
      setRejected(true);
    } else {
      const acceptedFilesNames = acceptedFiles.map(file => file.name);
      setUploading(uploading => [...uploading, ...acceptedFilesNames]);
      try {
        const documentsData = new FormData();
        documentsData.append('responseId', response._id);
        documentsData.append('documentType', 'attachments');
        acceptedFiles.forEach(file => documentsData.append('document', file));
        await axios.post(`${process.env.REACT_APP_API_URL}/files/document`, documentsData);
        refetch();
      } catch (error) {
        toast({
          ...toastFailed,
          title: 'Failed',
          description: 'Failed to upload document'
        });
      } finally {
        setUploading(uploading => uploading.filter(name => !acceptedFilesNames.includes(name)));
      }
    }
  };

  if (!response) {
    return null;
  }
  return (
    <Box fontWeight="700" mt={9} mb={3}>
      <Flex mb={2}>
        Attachments
        <Flex pl={1} opacity={0.4}>
          (optional)
        </Flex>
      </Flex>
      {response.attachments?.map((attachment, i) => (
        <DocumentUploaded key={i} document={attachment} />
      ))}
      {uploading.map(name => (
        <DocumentUploading key={name} documentName={name} />
      ))}
      <Can
        action="responses.edit"
        data={{ response }}
        yes={() => (
          <Dropzone
            multiple={true}
            accept={acceptedFileTypes}
            onDrop={(acceptedFiles, rejectedFiles) => upload({ acceptedFiles, rejectedFiles })}
          >
            {({ getRootProps, getInputProps }) => (
              <Box {...getRootProps()} w="100px" align="center" h="207x">
                <input {...getInputProps()} />
                <Button
                  rounded="lg"
                  fontWeight="500"
                  h="27px"
                  fontSize="12px"
                  bg="brand.bmiGreen"
                  color="#FFFFFF"
                  _hover={{ opacity: 0.7 }}
                >
                  <AttachmentIcon mr={2} />
                  Add attachments
                </Button>
              </Box>
            )}
          </Dropzone>
        )}
      />
      {rejected && (
        <Flex color="red.500" mt={2} fontSize="12px" fontWeight="bold">
          Document not uploaded. Accepted file types include{' '}
          {acceptedFileTypes.map((file) => file + ' ')}
        </Flex>
      )}
    </Box>
  );
};

export default Attachments;
