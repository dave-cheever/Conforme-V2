import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Text } from '@chakra-ui/react';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';

const ParticipantsDeleteModal = () => {
  const { isParticipantDeleteModalOpen, closeParticipantDeleteModal, label, selectParticipant, participantToDelete } =
    useParticipantsModalContext();

  return (
    <Modal isCentered isOpen={isParticipantDeleteModalOpen} onClose={closeParticipantDeleteModal} variant="teamModal">
      <ModalContent>
        <ModalHeader>
          <Text>Remove {label.toLowerCase()}?</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <Text color="participantsDeleteModal.modal.body">This action cannot be undone</Text>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button
            bg="participantsDeleteModal.modal.button.remove.bg"
            color="participantsDeleteModal.modal.button.remove.color"
            h="38px"
            onClick={() => {
              if (participantToDelete) selectParticipant(participantToDelete);
              closeParticipantDeleteModal();
            }}
            w="95px"
          >
            Remove
          </Button>
          <Button
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
};

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
