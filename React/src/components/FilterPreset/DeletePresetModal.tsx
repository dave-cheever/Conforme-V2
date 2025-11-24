import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';

interface DeletePresetModalProps {
  readonly isOpen: boolean;
  readonly presetToDelete: { id: string; name: string } | null;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

function DeletePresetModal({ isOpen, presetToDelete, onConfirm, onCancel }: Readonly<DeletePresetModalProps>) {
  const handleCancel = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    onCancel();
  };

  const handleClose = () => {
    onCancel();
  };

  return (
    <Modal
      closeOnEsc
      closeOnOverlayClick={false}
      data-id="002328"
      isCentered
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ModalOverlay data-id="002329" onClick={(e) => e.stopPropagation()} />
      <ModalContent data-id="002330" onClick={(e) => e.stopPropagation()}>
        <ModalHeader data-id="002331">Delete Filter Preset</ModalHeader>
        <ModalCloseButton
          data-id="002332"
          onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}
        />
        <ModalBody data-id="002333">
          <Text data-id="002334">Are you sure you want to delete the preset "{presetToDelete?.name}"? This action cannot be undone.</Text>
        </ModalBody>
        <ModalFooter data-id="002335">
          <Button
            data-id="002336"
            mr={3}
            onClick={(e) => {
              e.stopPropagation();
              handleCancel(e);
            }}
            variant="ghost">
            Cancel
          </Button>
          <Button
            colorScheme="red"
            data-id="002337"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            type="button">
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeletePresetModal;
