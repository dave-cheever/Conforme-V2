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
  <Modal data-id="de9fedfddfaf" isOpen={isOpen} onClose={handleClose}>
    <ModalOverlay data-id="1625bf003463" />
    <ModalContent data-id="d381b6c13b45">
      <ModalHeader data-id="fa82cf2f6a5b">Delete file</ModalHeader>
      <ModalCloseButton data-id="b78d4ac51007" />
      <ModalBody data-id="4ede0170853e" textAlign="center">{message}</ModalBody>
      <ModalFooter data-id="58e6367e25cb">
        <Flex data-id="03321d2eb92d" justify="center" w="full">
          <Button
            _hover={{ opacity: 0.7 }}
            colorScheme="purpleHeart"
            data-id="7012f872112b"
            mr={3}
            onClick={() => {
              handleDelete();
              handleClose();
            }}>
            Delete
          </Button>
          <Button
            _hover={{ opacity: 0.7 }}
            colorScheme="red"
            data-id="ce9a87c80179"
            onClick={() => handleClose()}>
            Cancel
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DocumentDeleteModal;
