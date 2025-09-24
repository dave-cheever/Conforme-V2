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
        data-id="000718"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        size="sm">
      <ModalOverlay data-id="000719" />
      <ModalContent data-id="000720">
        <ModalHeader data-id="000721">
          <Text data-id="000722" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="000723" />
        </ModalHeader>
        <ModalBody data-id="000724" mb="40px">
          <Stack data-id="000725">
            <Text data-id="000726">Are you sure you want to delete the following element?</Text>
            <Text data-id="000727" fontStyle="italic">{answer?.question?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000728">
          <HStack data-id="000729" justify="center" spacing={4} w="full">
            <Button data-id="000730" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="000731"
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
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
