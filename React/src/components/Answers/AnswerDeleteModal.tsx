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
    (<Modal
      data-id="b967abef06a4"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="sm">
      <ModalOverlay data-id="a1213b7b3a94" />
      <ModalContent data-id="15eb703f2c52">
        <ModalHeader data-id="ea71b18bc186">
          <Text data-id="29abd2d7a715" fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton data-id="428d6fb294c7" />
        </ModalHeader>
        <ModalBody data-id="81f881615ef0" mb="40px">
          <Stack data-id="4d801b072075">
            <Text data-id="37a4141e009f">Are you sure you want to delete the following element?</Text>
            <Text data-id="132dd88d2dcf" fontStyle="italic">{answer?.question?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="512fe19ea907">
          <HStack data-id="dc2acd401668" justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} data-id="5f5f3e2ba7ac" onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              data-id="3514dde6bfed"
              onClick={handleSecondaryButtonClick}>
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>)
  );
}

export default AnswerDeleteModal;
