import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Stack,
  Text,
} from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';

const AuditDeleteQuestionModal = ({ isOpen, onClose }) => {
  const { selectedQuestion, deleteCustomQuestionAndAnswer } = useAuditContext();

  if (!selectedQuestion) return null;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Delete question
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Stack>
            <Text>Are you sure you want to delete the following element?</Text>
            <Text fontStyle="italic">{selectedQuestion?.question}</Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="purpleHeart"
              mr={3}
              onClick={() => {
                deleteCustomQuestionAndAnswer(selectedQuestion);
                onClose();
              }}
            >
              Delete
            </Button>
            <Button
              _hover={{ opacity: 0.7 }}
              colorScheme="red"
              onClick={onClose}
            >
              Cancel
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

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
