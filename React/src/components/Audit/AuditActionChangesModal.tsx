import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

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
    (<Modal
      data-id="23c1c7bf1a9e"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="2xl">
      <ModalContent data-id="2db2fe2484c1">
        <ModalHeader data-id="0a7a7025079a">
          <Text data-id="db5b7fe4f052" fontSize="smm" fontWeight="semibold">
            Action changes
          </Text>
          <ModalCloseButton data-id="ac1df75d5223" />
        </ModalHeader>
        <ModalBody data-id="722047660fb3" mb="40px">
          <Stack data-id="dc94470b9fe7">
            <Text data-id="b77127f3ee7a">
              {selectedAction && selectedAction.title
                ? `Changes to Action '${selectedAction?.title}' will be lost`
                : 'Unsaved action will be lost'}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="13319fcfea59">
          <Stack
            data-id="69271cf078ae"
            direction={['column', 'row']}
            justify="center"
            spacing={4}
            w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="118a66038810" onClick={onClose}>
              Back to {t('question')}
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="78102633030f"
              onClick={() => {
                onSave();
                onClose();
              }}>
              Save action
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="red"
              data-id="cbb03d6c9042"
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
    </Modal>)
  );
};

export default AuditActionChangesModal;
