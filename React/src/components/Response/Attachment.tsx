import React, { useMemo, useState } from 'react';
import { Box, Text , Flex, useToast } from '@chakra-ui/react';
import Dropzone, { FileRejection } from 'react-dropzone';
import axios from 'axios';

import DocumentUploaded from './DocumentUploaded';
import DocumentUploading from './DocumentUploading';
import Can from '../can';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from '../../bootstrap/config';
import UploadIcon from '../../icons/UploadIcon';

const Attachment = () => {
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
    <Flex  w= "full" flexDirection="column" fontWeight="700" maxWidth="342px">
      <Flex fontSize="12px" mb={2}>
        Other attachments
      </Flex>
      {uploading.length > 0 ? uploading.map(name => (
        <Flex mb={3}  key={name}>
          <DocumentUploading documentName={name} />
        </Flex>
      )) : 
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
              <Box {...getRootProps()} w='full' align='center' minH='65px' cursor="pointer" mb={3}>
              <input {...getInputProps()} />
              <Flex 
                fontSize="14px" justify="space-between" fontWeight="semi_medium"
                color="#818197" align="center" 
                px={5} w="full" h="full" borderRadius="10px" 
                borderWidth="1px" borderStyle="dashed" borderColor="#D9D9E0"
              >
                <Flex> Drag and drop or <Text ml={1} color="#462AC4"> browse</Text></Flex>
                <UploadIcon color="#818197" w="21px" h="21px"/>
              </Flex>
            </Box>
            )}
          </Dropzone>
        )}
      />
      }
      {rejected && (
        <Flex color="red.500" mt={2} fontSize="12px" fontWeight="bold">
          Document not uploaded. Accepted file types include{' '}
          {acceptedFileTypes.map((file) => file + ' ')}
        </Flex>
      )}

      {response.attachments.length > 0 && <Flex fontSize="sm" fontWeight="bold" my={2}>
        Uploaded attachments
      </Flex>}
      
      {response.attachments?.map((attachment, i) => (
        <Flex  key={i} flexDir="column" mb={2}>
          <DocumentUploaded document={attachment} isAttachment />
        </Flex>
      ))}
    </Flex>
  );
};

export default Attachment;
