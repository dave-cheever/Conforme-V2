import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { useAuditContext } from '../../contexts/AuditProvider';

function AuditDeleteQuestionModal({ isOpen, onClose }) {
  const { selectedQuestion, deleteQuestion, deleteAnswer, refetch } = useAuditContext();

  if (!selectedQuestion) return null;

  return (
    (<Modal
      data-id="1cc460dc29c3"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="sm">
      <ModalContent data-id="52272079a833">
        <ModalHeader data-id="a7b080fac300">
          <Text data-id="c824ad466b39" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="0848c3710b30" />
        </ModalHeader>
        <ModalBody data-id="7e2938c488b2" mb="40px">
          <Stack data-id="226028baccd4">
            <Text data-id="433ee3b75034">Are you sure you want to delete the following element?</Text>
            <Text data-id="ac6eabd1a95d" fontStyle="italic">{selectedQuestion?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="ebb6c48b691d">
          <HStack data-id="fff4623ab452" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="42c1a1d04a1c" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="9d3f98aa27ee"
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
    </Modal>)
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
