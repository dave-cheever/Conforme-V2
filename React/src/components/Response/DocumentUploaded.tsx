import React from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';

import { useResponseContext } from '../../contexts/ResponseProvider';
import { BlankPage, DownloadIcon, Trashcan } from '../../icons';
import { IDocument } from '../../interfaces/IResponse';
import Can from '../can';

const GET_DOCUMENT_DETAILS = gql`
  query FilesDetails($filesDetailsQuery: FilesDetailsQuery) {
    filesDetails(filesDetailsQuery: $filesDetailsQuery) {
      id
      thumbnail
      path
      preview
    }
  }
`;

const REMOVE_DOCUMENT = gql`
  mutation ($responseDocumentRemoveInput: ResponseDocumentRemoveInput!) {
    removeDocument(responseDocumentRemoveInput: $responseDocumentRemoveInput)
  }
`;

const DocumentUploaded = ({
  document,
  isEvidence = false,
  isAttachment = false,
  outDated = false,
}: {
  document: IDocument | undefined;
  isAttachment?: boolean;
  isEvidence?: boolean;
  outDated?: boolean;
}) => {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, {
    variables: { filesDetailsQuery: { ids: [document?.id] } },
  });
  const [removeDocument] = useMutation(REMOVE_DOCUMENT);
  const { response, snapshot, refetch } = useResponseContext();
  const {
    onOpen: handleDeleteOpen,
    onClose: handleDeleteClose,
    isOpen: deleteIsOpen,
  } = useDisclosure();
  const documentDetails = (data?.filesDetails || [])[0];

  const remove = async () => {
    await removeDocument({
      variables: {
        responseDocumentRemoveInput: {
          _id: response?._id,
          documentId: document?.id,
          documentType: isEvidence ? 'evidence' : 'attachment',
        },
      },
    });
    refetch();
  };

  const renderDeleteModal = () => (
    <Modal isOpen={deleteIsOpen} onClose={handleDeleteClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete file</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          Are you sure you wish to delete {document?.name}? It will reset the
          status for the last iteration to non-compliant.
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            {!snapshot && (
              <Button
                _hover={{ opacity: 0.7 }}
                colorScheme="purpleHeart"
                mr={3}
                onClick={() => {
                  remove();
                  handleDeleteClose();
                }}
              >
                Delete
              </Button>
            )}
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="red"
              onClick={() => {
                handleDeleteClose();
              }}
            >
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      {deleteIsOpen && renderDeleteModal()}
      <Flex
        align="center"
        bg="documentUploaded.bg"
        borderRadius="10px"
        color="brand.darkGrey"
        fontWeight="400"
        h="65px"
        justify="space-between"
        key={document?.id}
        maxWidth="400px"
        minW={['none', '342px']}
        role="group"
        w="full"
      >
        <Flex align="center" justify="space-between" w="full">
          <Box
            align="center"
            bg="documentUploaded.thumbnailBg"
            borderRadius="10px"
            flexShrink={0}
            fontSize="12px"
            h="55px"
            ml="5px"
            mr={2}
            w="55px"
          >
            <Image
              fallback={
                <Flex align="center" h="full">
                  <BlankPage h="30px" w="55px" />
                </Flex>
              }
              maxHeight="55px"
              maxWidth="55px"
              src={documentDetails?.thumbnail}
            />
          </Box>
          <Flex
            direction="column"
            fontSize="12px"
            mr={2}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            <Text
              cursor="pointer"
              fontWeight="700"
              noOfLines={1}
              onClick={() => {
                if (documentDetails?.preview)
                  window.open(documentDetails?.preview);
              }}
              textOverflow="ellipsis"
            >
              {document?.name}
            </Text>
            <Flex opacity="0.6">
              Uploaded {document && format(new Date(document.addedAt), 'Pp')}
            </Flex>
          </Flex>
          {(isAttachment || isEvidence) && !outDated && (
            <Flex>
              <Can
                action="responses.edit"
                data={{ response }}
                yes={() => (
                  <IconButton
                    _hover={{ bg: '' }}
                    aria-label="delete evidence"
                    bg=""
                    display="inline-block"
                    icon={
                      <DownloadIcon stroke="documentUploaded.downloadIcon" />
                    }
                    ml={3}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(documentDetails?.path);
                    }}
                  />
                )}
              />
              {!snapshot && (
                <Can
                  action="responses.edit"
                  data={{ response }}
                  yes={() => (
                    <IconButton
                      _hover={{ bg: '' }}
                      aria-label="delete evidence"
                      bg=""
                      display="inline-block"
                      icon={<Trashcan stroke="documentUploaded.binIcon" />}
                      mr={3}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOpen();
                      }}
                    />
                  )}
                />
              )}
            </Flex>
          )}
          {outDated && (
            <Can
              action="responses.edit"
              data={{ response }}
              yes={() => (
                <IconButton
                  aria-label="delete evidence"
                  bg=""
                  display="inline-block"
                  icon={<DownloadIcon stroke="documentUploaded.downloadIcon" />}
                  mr={3}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(documentDetails?.path);
                  }}
                />
              )}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default DocumentUploaded;

export const documentUploadedStyles = {
  documentUploaded: {
    bg: '#F2F2F2',
    thumbnailBg: '#FFFFFF',
    downloadIcon: '#282F36',
    binIcon: 'black',
  },
};
