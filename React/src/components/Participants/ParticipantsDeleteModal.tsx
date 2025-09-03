import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

function ParticipantsDeleteModal({ onRemove }: { onRemove?: (participantId: string) => void }) {
  const { isParticipantDeleteModalOpen, closeParticipantDeleteModal, label, participantToDelete } = useParticipantsModalContext();

  const handleRemove = () => {
    if (participantToDelete && onRemove) onRemove(participantToDelete.userId);

    closeParticipantDeleteModal();
  };

  return (
    <Modal
      data-id="030925-5a5fe9"
      isCentered
      isOpen={isParticipantDeleteModalOpen}
      onClose={closeParticipantDeleteModal}
      variant="teamModal"
    >
      <ModalContent data-id="030925-4989bb">
        <ModalHeader data-id="030925-3d023c">
          <Text data-id="030925-426ae9">Remove {label.toLowerCase()}?</Text>
          <ModalCloseButton data-id="030925-0df02e" />
        </ModalHeader>
        <ModalBody data-id="030925-d1f1e0">
          <Text data-id="030925-50c594" color="participantsDeleteModal.modal.body">
            This action cannot be undone
          </Text>
        </ModalBody>
        <ModalFooter data-id="030925-ae724a" justifyContent="space-between">
          <Button
            data-id="030925-dff732"
            bg="participantsDeleteModal.modal.button.remove.bg"
            color="participantsDeleteModal.modal.button.remove.color"
            h="38px"
            onClick={handleRemove}
            w="95px"
          >
            Remove
          </Button>
          <Button
            data-id="030925-b4e9f1"
            _hover={{ opacity: '0.9' }}
            bg="participantsDeleteModal.modal.button.keep.bg"
            color="participantsDeleteModal.modal.button.keep.color"
            h="38px"
            onClick={closeParticipantDeleteModal}
            w="75px"
          >
            Keep
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ParticipantsDeleteModal;

export const participantsDeleteModalStyles = {
  participantsDeleteModal: {
    modal: {
      body: '#818197',
      button: {
        remove: {
          bg: '#F0F2F5',
          color: '#818197',
        },
        keep: {
          bg: '#462AC4',
          color: '#FFFFFF',
        },
      },
    },
  },
};
