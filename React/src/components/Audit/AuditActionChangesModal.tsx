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
        data-id="000031"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="2xl">
      <ModalContent data-id="000032">
        <ModalHeader data-id="000033">
          <Text data-id="000034" fontSize="smm" fontWeight="semibold">
            Action changes
          </Text>
          <ModalCloseButton data-id="000035" />
        </ModalHeader>
        <ModalBody data-id="000036" mb="40px">
          <Stack data-id="000037">
            <Text data-id="000038">
              {selectedAction && selectedAction.title
                ? `Changes to Action '${selectedAction?.title}' will be lost`
                : 'Unsaved action will be lost'}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000039">
          <Stack
            data-id="000040"
            direction={['column', 'row']}
            justify="center"
            spacing={4}
            w="full">
            <Button data-id="000041" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Back to {t('question')}
            </Button>
            <Button
              data-id="000042"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={() => {
                onSave();
                onClose();
              }}>
              Save action
            </Button>
            <Button
              data-id="000043"
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
