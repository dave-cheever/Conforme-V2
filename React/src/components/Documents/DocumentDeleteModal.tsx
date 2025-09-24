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
    <Modal data-id="000478" isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay data-id="000479" />
      <ModalContent data-id="000480">
        <ModalHeader data-id="000481">Delete file</ModalHeader>
        <ModalCloseButton data-id="000482" />
        <ModalBody data-id="000483" textAlign="center">{message}</ModalBody>
        <ModalFooter data-id="000484">
          <Flex data-id="000485" justify="center" w="full">
            <Button
              data-id="000486"
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
              data-id="000487"
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
