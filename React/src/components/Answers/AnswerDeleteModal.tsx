import { gql, useMutation } from '@apollo/client';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { t } from 'i18next';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import { useAdminContext } from '../../contexts/AdminProvider';
import { IAnswer } from '../../interfaces/IAnswer';

const DELETE_ANSWER = gql`
  mutation ($_id: ID!) {
    deleteAnswer(_id: $_id)
  }
`;

function AnswerDeleteModal({
  answer,
  isOpen,
  onClose,
  refetchAnswers,
}: {
  answer: IAnswer;
  isOpen: boolean;
  onClose: () => void;
  refetchAnswers: () => void;
}) {
  const [deleteAnswer] = useMutation(DELETE_ANSWER);
  const toast = useToast();
  const { setAdminModalState } = useAdminContext();

  const handleSecondaryButtonClick = async () => {
    if (!answer) return;
    try {
      await deleteAnswer({
        variables: {
          _id: answer._id,
        },
      });
      refetchAnswers();
      toast({ ...toastSuccess, description: 'Answer deleted' });
    } catch (e: any) {
      toast({
        ...toastFailed,
        description: e.message,
      });
    } finally {
      onClose();
      setAdminModalState('closed');
    }
  };
  return (
    <Modal
        data-id="030925-f90a96"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalOverlay data-id="030925-c13fab" />
      <ModalContent data-id="030925-8634ac">
        <ModalHeader data-id="030925-2420c9">
          <Text data-id="030925-909393" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="030925-5ae6ff" />
        </ModalHeader>
        <ModalBody data-id="030925-2498ce" mb="40px">
          <Stack data-id="030925-5885ca">
            <Text data-id="030925-4728aa">Are you sure you want to delete the following element?</Text>
            <Text data-id="030925-082b7c" fontStyle="italic">{answer?.question?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-ce5c75">
          <HStack data-id="030925-91a833" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="030925-a96e1f" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="030925-8f5b99"
              onClick={handleSecondaryButtonClick}>
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AnswerDeleteModal;
