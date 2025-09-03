import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAuditContext } from '../../contexts/AuditProvider';

function AuditDeleteQuestionModal({ isOpen, onClose }) {
  const { selectedQuestion, deleteQuestion, deleteAnswer, refetch } = useAuditContext();

  if (!selectedQuestion) return null;

  return (
    <Modal
        data-id="030925-202cf5"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalContent data-id="030925-4001a7">
        <ModalHeader data-id="030925-3f7ba3">
          <Text data-id="030925-386c41" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="030925-d48bbf" />
        </ModalHeader>
        <ModalBody data-id="030925-50e738" mb="40px">
          <Stack data-id="030925-f82cf0">
            <Text data-id="030925-a70f77">Are you sure you want to delete the following element?</Text>
            <Text data-id="030925-2b038b" fontStyle="italic">{selectedQuestion?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-622a4e">
          <HStack data-id="030925-e5f9cf" justify="center" spacing={4} w="full">
            <Button data-id="030925-5533c0" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="030925-aea24d"
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
