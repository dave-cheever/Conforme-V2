import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAuditContext } from '../../contexts/AuditProvider';

function AuditActionChangesModal({ onSave, setSelectedAction, isAcionFormValid }) {
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
    <Modal
        data-id="030925-3c7ce1"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="2xl">
      <ModalContent data-id="030925-d533d3">
        <ModalHeader data-id="030925-cafb33">
          <Text data-id="030925-784a4d" fontSize="smm" fontWeight="semibold">
            Action changes
          </Text>
          <ModalCloseButton data-id="030925-9ae5f1" />
        </ModalHeader>
        <ModalBody data-id="030925-a08c45" mb="40px">
          <Stack data-id="030925-55a1a1">
            <Text data-id="030925-e8c280">
              {selectedAction && selectedAction.title
                ? `Changes to Action '${selectedAction?.title}' will be lost`
                : 'Unsaved action will be lost'}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-96097c">
          <Stack
            data-id="030925-3962fd"
            direction={['column', 'row']}
            justify="center"
            spacing={4}
            w="full">
            <Button data-id="030925-c9d32d" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Back to {t('question')}
            </Button>
            <Button
              data-id="030925-e44c6a"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={() => {
                onSave();
                onClose();
              }}>
              Save action
            </Button>
            <Button
              data-id="030925-f1e9e9"
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
              }>
              Continue without saving action
            </Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AuditActionChangesModal;
