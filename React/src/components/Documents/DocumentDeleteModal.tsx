import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';

function DocumentDeleteModal({
  message,
  isOpen,
  handleClose,
  handleDelete,
}: {
  message: string;
  isOpen: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}) {
  return (
    <Modal data-id="030925-a37405" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay data-id="030925-83b4d2" />
      <ModalContent data-id="030925-694688">
        <ModalHeader data-id="030925-5bd970">Delete file</ModalHeader>
        <ModalCloseButton data-id="030925-cef9f2" />
        <ModalBody data-id="030925-1805bd" textAlign="center">{message}</ModalBody>
        <ModalFooter data-id="030925-895294">
          <Flex data-id="030925-bb6211" justify="center" w="full">
            <Button
              data-id="030925-a6246e"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              mr={3}
              onClick={() => {
                handleDelete();
                handleClose();
              }}>
              Delete
            </Button>
            <Button
              data-id="030925-b7658d"
              _hover={{ opacity: 0.7 }}
              colorScheme="red"
              onClick={() => handleClose()}>
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DocumentDeleteModal;
