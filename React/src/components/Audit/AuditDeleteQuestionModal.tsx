import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAuditContext } from '../../contexts/AuditProvider';

function AuditDeleteQuestionModal({ isOpen, onClose }) {
  const { selectedQuestion, deleteQuestion, deleteAnswer, refetch } = useAuditContext();

  if (!selectedQuestion) return null;

  return (
    <Modal
        data-id="000180"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="000181">
        <ModalHeader data-id="000182">
          <Text data-id="000183" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="000184" />
        </ModalHeader>
        <ModalBody data-id="000185" mb="40px">
          <Stack data-id="000186">
            <Text data-id="000187">Are you sure you want to delete the following element?</Text>
            <Text data-id="000188" fontStyle="italic">{selectedQuestion?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000189">
          <HStack data-id="000190" justify="center" spacing={4} w="full">
            <Button data-id="000191" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="000192"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={async () => {
                await deleteQuestion({
                  variables: {
                    _id: selectedQuestion._id,
                  },
                });
                if (selectedQuestion.answer) {
                  await deleteAnswer({
                    variables: {
                      _id: selectedQuestion.answer?._id,
                    },
                  });
                }
                refetch();
                onClose();
              }}>
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export const auditNewQuestionModalStyles = {
  auditNewQuestionModal: {
    tile: {
      bg: {
        default: '#F4F3F5',
        hover: '#EBEAEF',
      },
      icon: {
        stroke: '#1E1836',
        fill: 'transparent',
      },
    },
  },
};

export default AuditDeleteQuestionModal;
