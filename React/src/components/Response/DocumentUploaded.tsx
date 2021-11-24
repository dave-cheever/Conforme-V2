import React from "react";
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
  useDisclosure
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { gql, useMutation, useQuery } from "@apollo/client";

import { IDocument } from "../../interfaces/IResponse";
import Can from "../can";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { BlankPage } from "../../icons";
import { format } from "date-fns";

const GET_DOCUMENT_DETAILS = gql`
  query FilesDetails($filesDetailsQuery: FilesDetailsQuery) {
    filesDetails(filesDetailsQuery: $filesDetailsQuery) {
      id
      thumbnail
      path
    }
  }
`;

const REMOVE_DOCUMENT = gql`
  mutation ($responseDocumentRemoveInput: ResponseDocumentRemoveInput!) {
    removeDocument(responseDocumentRemoveInput: $responseDocumentRemoveInput)
  }
`;

const DocumentUploaded = ({ document, isEvidence = false }: { document: IDocument, isEvidence?: boolean }) => {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, { variables: { filesDetailsQuery: { ids: [document.id] } } });
  const [removeDocument] = useMutation(REMOVE_DOCUMENT);
  const {
    response,
    refetch,
  } = useResponseContext();
  const { onOpen: handleDeleteOpen, onClose: handleDeleteClose, isOpen: deleteIsOpen } = useDisclosure();
  const documentDetails = (data?.filesDetails || [])[0];

  const remove = async () => {
    await removeDocument({
      variables: {
        responseDocumentRemoveInput: {
          _id: response?._id,
          documentId: document.id,
          documentType: isEvidence ? 'evidence' : 'attachment'
        },
      },
    });
    refetch();
  }

  const renderDeleteModal = () => (
    <Modal isOpen={deleteIsOpen} onClose={handleDeleteClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete file</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign='center'>
          Are you sure you wish to delete {document.name}? It will reset the status for the last iteration to non-compliant.
        </ModalBody>
        <ModalFooter >
          <Flex w='full' justify='center'>
            <Button
              bg='brand.primary'
              color='#FFFFFF'
              mr={3}
              onClick={() => {
                remove();
                handleDeleteClose();
              }}
              _hover={{ opacity: 0.7 }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                handleDeleteClose();
              }}
              bg='brand.bmiGreen'
              color='#FFFFFF'
              _hover={{ opacity: 0.7 }}
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
        key={document.id}
        w='full'
        h='65px'
        fontWeight='400'
        bg='#F2F2F2'
        rounded='md'
        mb='2'
        maxWidth='400px'
        align='center'
        justify='space-between'
        color='brand.darkGrey'
        role="group"
        onClick={(e) => {
          e.stopPropagation();
          window.open(documentDetails?.path)
        }}
        _hover={{
          cursor: 'pointer', boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.18)', bg: '#FFFFFF'
        }}
      >
        <Flex align='center'>
          <Box w='55px' h='55px' bg='#FFFFFF' rounded='md' ml='5px' mr={2} fontSize='12px' flexShrink={0} align='center'>
            <Image
              maxWidth='55px'
              fallback={<Flex align='center' h='full'><BlankPage h='30px' w='55px' /></Flex>}
              maxHeight='55px'
              src={documentDetails?.thumbnail}
            />
          </Box>
          <Flex direction='column' overflow='hidden' textOverflow='ellipsis' maxW={['150px', '250px']} fontSize='12px' mr={2}>
            <Flex fontWeight='700' >{document?.name}</Flex>
            <Flex opacity='0.6'>Uploaded {document && format(new Date(document.addedAt), 'Pp')}</Flex>
          </Flex>
        </Flex>
        <Can
          action='responses.edit'
          data={{ response }}
          yes={() => (
            <IconButton
              aria-label='delete evidence'
              icon={<CloseIcon color='#FC5960' />}
              bg='#FFFFFF'
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteOpen();
              }}
              mr={3}
              display={['block', 'none']}
              _hover={{ bg: 'brand.borderColor' }}
              _groupHover={{ display: 'inline-block' }}
            />
          )}
        />
      </Flex>
    </>
  )
};

export default DocumentUploaded;
