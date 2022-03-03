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
  useDisclosure,
  Text
} from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { format } from "date-fns";

import { IDocument } from "../../interfaces/IResponse";
import Can from "../can";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { Bin, BlankPage, DownloadIcon } from "../../icons";


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

const DocumentUploaded = ({ document, isEvidence = false, isAttachment = false, outDated = false }: { document: IDocument | undefined, isAttachment?: boolean, isEvidence?: boolean, outDated?: boolean }) => {
  const { data } = useQuery(GET_DOCUMENT_DETAILS, { variables: { filesDetailsQuery: { ids: [document?.id] } } });
  const [removeDocument] = useMutation(REMOVE_DOCUMENT);
  const {
    response,
    snapshot,
    refetch,
  } = useResponseContext();
  const { onOpen: handleDeleteOpen, onClose: handleDeleteClose, isOpen: deleteIsOpen } = useDisclosure();
  const documentDetails = (data?.filesDetails || [])[0];

  const remove = async () => {
    await removeDocument({
      variables: {
        responseDocumentRemoveInput: {
          _id: response?._id,
          documentId: document?.id,
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
          Are you sure you wish to delete {document?.name}? It will reset the status for the last iteration to non-compliant.
        </ModalBody>
        <ModalFooter >
          <Flex w='full' justify='center'>
            {!snapshot && <Button
              colorScheme="purpleHeart"
              mr={3}
              onClick={() => {
                remove();
                handleDeleteClose();
              }}
              _hover={{ opacity: 0.7 }}
            >
              Delete
            </Button>}
            <Button
              onClick={() => {
                handleDeleteClose();
              }}
              colorScheme="red"
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
        key={document?.id}
        w='full'
        h='65px'
        fontWeight='400'
        bg="documentUploaded.bg"
        borderRadius="10px"
        maxWidth='400px'
        align='center'
        justify='space-between'
        color='brand.darkGrey'
        role="group"
        minW={["none","342px"]}
      >
        <Flex align='center' w="full" justify="space-between">
          <Box w='55px' h='55px' bg='documentUploaded.thumbnailBg' borderRadius="10px" ml='5px' mr={2} fontSize='12px' flexShrink={0} align='center'>
            <Image
              maxWidth='55px'
              fallback={<Flex align='center' h='full'><BlankPage h='30px' w='55px' /></Flex>}
              maxHeight='55px'
              src={documentDetails?.thumbnail}
            />
          </Box>
          <Flex direction='column' overflow='hidden' textOverflow='ellipsis' fontSize='12px' mr={2}>
            <Text fontWeight='700' noOfLines={1} textOverflow="ellipsis" cursor="pointer" onClick={() => {if(documentDetails?.preview) window.open(documentDetails?.preview)}}>{document?.name}</Text>
            <Flex opacity='0.6'>Uploaded {document && format(new Date(document.addedAt), 'Pp')}</Flex>
          </Flex>
        {(isAttachment || isEvidence) && !outDated && (
          <Flex>
            <Can
              action='responses.edit'
              data={{ response }}
              yes={() => (
                <IconButton
                  aria-label='delete evidence'
                  icon={<DownloadIcon stroke="documentUploaded.downloadIcon" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(documentDetails?.path)
                  }}
                  ml={3}
                  _hover={{ bg: "" }}
                  bg=""
                  display="inline-block"
                />
              )}
            />
            {!snapshot && <Can
              action='responses.edit'
              data={{ response }}
              yes={() => (
                <IconButton
                  aria-label='delete evidence'
                  _hover={{ bg: "" }}
                  icon={<Bin stroke="documentUploaded.binIcon" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteOpen();
                  }}
                  mr={3}
                  bg=""
                  display="inline-block"
                />
              )}
            />}
          </Flex>
        )}
        {outDated && <Can
          action='responses.edit'
          data={{ response }}
          yes={() => (
            <IconButton
              aria-label='delete evidence'
              icon={<DownloadIcon stroke="documentUploaded.downloadIcon" />}
              onClick={(e) => {
                e.stopPropagation();
                window.open(documentDetails?.path)
              }}
              mr={3}
              bg=""
              display="inline-block"
            />
          )}
        />}
        </Flex>
      </Flex>
    </>
  )
};

export default DocumentUploaded;

export const documentUploadedStyles = {
  documentUploaded: {
    bg: "#F2F2F2",
    thumbnailBg: "#FFFFFF",
    downloadIcon: "#282F36",
    binIcon: "black"
  }
}
