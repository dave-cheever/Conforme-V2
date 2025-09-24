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
      data-id="000612"
      isCentered
      isOpen={isParticipantDeleteModalOpen}
      onClose={closeParticipantDeleteModal}
      variant="teamModal"
    >
      <ModalContent data-id="000613">
        <ModalHeader data-id="000614">
          <Text data-id="000615">Remove {label.toLowerCase()}?</Text>
          <ModalCloseButton data-id="000616" />
        </ModalHeader>
        <ModalBody data-id="000617">
          <Text data-id="000618" color="participantsDeleteModal.modal.body">
            This action cannot be undone
          </Text>
        </ModalBody>
        <ModalFooter data-id="000619" justifyContent="space-between">
          <Button
            data-id="000620"
            bg="participantsDeleteModal.modal.button.remove.bg"
            color="participantsDeleteModal.modal.button.remove.color"
            h="38px"
            onClick={handleRemove}
            w="95px"
          >
            Remove
          </Button>
          <Button
            data-id="000621"
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
