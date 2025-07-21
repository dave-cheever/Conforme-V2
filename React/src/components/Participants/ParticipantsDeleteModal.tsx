import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

function ParticipantsDeleteModal({ onRemove }: { onRemove?: (participantId: string) => void }) {
  const { isParticipantDeleteModalOpen, closeParticipantDeleteModal, label, participantToDelete } = useParticipantsModalContext();

  const handleRemove = () => {
    if (participantToDelete && onRemove) 
      onRemove(participantToDelete._id);
    
    closeParticipantDeleteModal();
  };

  return (
    <Modal
      data-id="5d0af184408c"
      isCentered
      isOpen={isParticipantDeleteModalOpen}
      onClose={closeParticipantDeleteModal}
      variant="teamModal"
    >
      <ModalContent data-id="4f49a4aeb51f">
        <ModalHeader data-id="5163fcb7cc9c">
          <Text data-id="d41c2355a9ce">Remove {label.toLowerCase()}?</Text>
          <ModalCloseButton data-id="8a2cda35da35" />
        </ModalHeader>
        <ModalBody data-id="339501811b67">
          <Text color="participantsDeleteModal.modal.body" data-id="ed0a0fc7bed4">
            This action cannot be undone
          </Text>
        </ModalBody>
        <ModalFooter data-id="9699f036a6da" justifyContent="space-between">
          <Button
            bg="participantsDeleteModal.modal.button.remove.bg"
            color="participantsDeleteModal.modal.button.remove.color"
            data-id="fe6e694b76f2"
            h="38px"
            onClick={handleRemove}
            w="95px"
          >
            Remove
          </Button>
          <Button
            _hover={{ opacity: '0.9' }}
            bg="participantsDeleteModal.modal.button.keep.bg"
            color="participantsDeleteModal.modal.button.keep.color"
            data-id="aa6036311c4b"
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
