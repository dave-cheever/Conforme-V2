import React, { useMemo, useState } from 'react'
import { Box, Flex, useToast, Text } from '@chakra-ui/react';
import Dropzone, { FileRejection } from 'react-dropzone';
import axios from 'axios';

import Can from '../can';
import DocumentUploading from './DocumentUploading';
import DocumentUploaded from './DocumentUploaded';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from '../../bootstrap/config';
import { Asterisk, UploadIcon } from '../../icons';

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
    <Flex direction='column' w="full" maxW="342px">
      <Flex align='center' mb={2} mt={3} >
        <Box fontWeight='700' fontSize={11} color="evidence.fontColor" width="300px" lineHeight="16px">{evidence.name} 
        <Asterisk ml="5px" mb="5px" fill="questionListElement.iconAsterisk" stroke='datepicker.iconAsterisk' w="9px" h="9px" /></Box>
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
                    <Box {...getRootProps()} w='full' align='center' h='65px' cursor="pointer">
                      <input {...getInputProps()} />
                      <Flex
                        fontSize="14px" justify="space-between"
                        color="evidence.uploadFontColor" align="center"
                        px={5} w="full" h="full" borderRadius="10px"
                        borderWidth="1px" borderStyle="dashed" borderColor="evidence.uploadBorderColor"
                      >
                        <Flex> Drag and drop or <Text ml={1} color="evidence.browseFontColor"> browse</Text></Flex>
                        <UploadIcon w="21px" h="21px" />
                      </Flex>
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


export const evidenceStyles = {
  evidence: {
    fontColor: "#1F1F1F",
    requiredColor: "#E93C44",
    borderColor: "#D9D9E0",
    uploadFontColor: "#818197",
    uploadBorderColor: "#D9D9E0",
    browseFontColor: "#462AC4",
    uploadBg: "#FFFFFF"
  }
}