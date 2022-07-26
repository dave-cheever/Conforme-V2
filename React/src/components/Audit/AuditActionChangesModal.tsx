import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';

const AuditActionChangesModal = ({ onSave, setSelectedAction, isAcionFormValid }) => {
  const {
    actionChangesModalOnContinue: onContinue,
    handleActionChangesModalClose: onClose,
    selectedAction,
    isActionChangesModalOpen: isOpen,
  } = useAuditContext();

  if (isOpen && !isAcionFormValid) {
    setSelectedAction(undefined);
    onClose();
    return null;
  }

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Action changes
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Stack>
            <Text>
              {selectedAction && selectedAction.title
                ? `Changes to Action '${selectedAction?.title}' will be lost`
                : 'Unsaved action will be lost'}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} onClick={onClose}>
              Back to walk item
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={() => {
                onSave();
                onClose();
              }}
            >
              Save action
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="red"
              onClick={
                onContinue
                  ? () => {
                      onContinue();
                      setSelectedAction(undefined);
                      onClose();
                    }
                  : onClose
              }
            >
              Continue without saving action
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuditActionChangesModal;
