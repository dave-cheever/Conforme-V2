import React, { useMemo, useState } from 'react'
import { Box, Button, Flex, useToast } from '@chakra-ui/react';
import { AttachmentIcon } from '@chakra-ui/icons';
import Dropzone, { FileRejection } from 'react-dropzone';
import axios from 'axios';

import { UploadedCross, UploadedTick } from '../../icons';
import Can from '../can';
import DocumentUploading from './DocumentUploading';
import DocumentUploaded from './DocumentUploaded';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from '../../bootstrap/config';

const EvidenceExpected = ({ evidence }) => {
  const toast = useToast();
  const {
    response,
    refetch,
  } = useResponseContext();
  const acceptedFileTypes = useMemo(() => ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', 'image/*', '.zip', '.html', '.pptx', '.ppt', '.msg'], []);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'rejected'>('idle');

  const upload = async ({ acceptedFile, rejectedFile }: { acceptedFile: File; rejectedFile: FileRejection; }) => {
    if (!response) {
      return;
    }
    if (rejectedFile) {
      setStatus('rejected');
    } else {
      setStatus('uploading');
      try {
        const documentsData = new FormData();
        documentsData.append('responseId', response._id);
        documentsData.append('documentName', evidence.name);
        documentsData.append('documentType', 'evidence');
        documentsData.append('document', acceptedFile);
        await axios.post(`${process.env.REACT_APP_API_URL}/files/document`, documentsData);
        refetch();
      } catch (error) {
        toast({
          ...toastFailed,
          title: 'Failed',
          description: 'Failed to upload document'
        });
      } finally {
        setStatus('idle');
      }
    }
  };

  if (!response) {
    return null;
  }
  return (
    <Flex direction='column' mb={2} >
      <Flex align='center'>
        {evidence.uploaded?.id ?
          <UploadedTick h='13px' ml={1} mr={2} color='brand.bmiGreen' /> :
          <UploadedCross h='13px' ml={1} mr={2} color='brand.primary' />
        }
        <Box fontWeight='400' my={2} width="300px">{evidence.name}</Box>
      </Flex>
      {evidence.uploaded?.id ?
        <DocumentUploaded document={evidence.uploaded} isEvidence={true} /> :
        status === 'uploading' ?
          <DocumentUploading documentName={evidence.name} /> :
          (
            <Can
              action='responses.edit'
              data={{ response }}
              yes={() => (
                <Dropzone
                  multiple={false}
                  accept={acceptedFileTypes}
                  onDrop={(acceptedFiles, rejectedFiles) => upload({ acceptedFile: acceptedFiles[0], rejectedFile: rejectedFiles[0] })}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box {...getRootProps()} w='100px' align='center' h='207x'>
                      <input {...getInputProps()} />
                      <Button
                        mt={1}
                        rounded='lg'
                        fontWeight='500'
                        h='27px'
                        fontSize='12px'
                        bg='black'
                        color='#FFFFFF'
                        _hover={{ opacity: 0.7 }}
                      ><AttachmentIcon mr={2} />Add evidence</Button>
                    </Box>
                  )}
                </Dropzone>
              )}
            />
          )
      }
      {status === 'rejected' && (
        <Flex
          color='red.500'
          mt={2}
          fontSize='12px'
          fontWeight='bold'
        >Document not uploaded. Accepted file types include {acceptedFileTypes.map((file) => file + ' ')}</Flex>
      )}
    </Flex>
  )
};

export default EvidenceExpected;
