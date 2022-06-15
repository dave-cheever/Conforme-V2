import { gql, useMutation } from '@apollo/client';
import { Button, HStack, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { t } from 'i18next';

import { IAnswer } from '../../interfaces/IAnswer';

const DELETE_ANSWER = gql`
  mutation ($_id: ID!) {
    deleteAnswer(_id: $_id)
  }
`;

const WalkItemDeleteModal = ({
  answer,
  isOpen,
  onClose,
  refetchAnswers,
}: {
  answer: IAnswer;
  isOpen: boolean;
  onClose: () => void;
  refetchAnswers: () => void;
}) => {
  const [deleteAnswer] = useMutation(DELETE_ANSWER);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Delete {t('question')}
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Stack>
            <Text>Are you sure you want to delete the following element?</Text>
            <Text fontStyle="italic">{answer?.question?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justify="center" spacing={4} w="full">
            <Button _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              onClick={async () => {
                await deleteAnswer({
                  variables: {
                    _id: answer._id,
                  },
                });
                refetchAnswers();
                onClose();
              }}
            >
              Delete
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalkItemDeleteModal;
