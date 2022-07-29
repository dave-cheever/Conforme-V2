import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

const DocumentDeleteModal = ({
  message,
  isOpen,
  handleClose,
  handleDelete,
}: {
  message: string;
  isOpen: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}) => (
  <Modal isOpen={isOpen} onClose={handleClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Delete file</ModalHeader>
      <ModalCloseButton />
      <ModalBody textAlign="center">{message}</ModalBody>
      <ModalFooter>
        <Flex justify="center" w="full">
          <Button
            _hover={{ opacity: 0.7 }}
            colorScheme="purpleHeart"
            mr={3}
            onClick={() => {
              handleDelete();
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button _hover={{ opacity: 0.7 }} colorScheme="red" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DocumentDeleteModal;
