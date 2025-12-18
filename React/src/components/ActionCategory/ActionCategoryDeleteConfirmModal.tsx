import { Box, Button, Flex, Modal, ModalContent, ModalOverlay, Spinner } from '@chakra-ui/react';

interface IActionCategoryDeleteConfirmModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionCategoryName: string;
}

const ActionCategoryDeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  actionCategoryName,
}: IActionCategoryDeleteConfirmModal) => {
  return (
    <Modal data-id="000326" isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay data-id="000327" />
      <ModalContent bg="white" borderRadius="12px" boxShadow="lg" data-id="000328" p={6} textAlign="center">
        <Box color="#2D3748" data-id="000329" fontSize="20px" fontWeight="500" mb={4} lineHeight='100%'>
          Confirm Delete
        </Box>
        <Box color="#2D3748" data-id="000330" mb={6}>
          Are you sure you want to delete the action category{' '}
          <Box data-id="013095" as="span" color="#2D3748" fontWeight="bold">
            {actionCategoryName}
          </Box>
          ? This action cannot be undone.
        </Box>
        <Flex data-id="000331" justify="center">
          <Button
            colorScheme="#2D3748"
            data-id="000332"
            mr={3}
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            data-id="000333"
            onClick={onConfirm}
            spinner={<Spinner data-id="013096" color="white" size="sm" />}
          >
            Delete
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default ActionCategoryDeleteConfirmModal;

