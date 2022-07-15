import reactStringReplace from 'react-string-replace';

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
} from '@chakra-ui/react';

import ChatMention from './ChatMention';

interface IResponseChatConfirmDeleteModal {
  isOpen: boolean;
  messageId: string;
  message: string;
  onClose: () => void;
  onAction: (id: string) => void;
}

const ResponseChatConfirmDeleteModal = ({ isOpen, messageId, message, onClose, onAction }: IResponseChatConfirmDeleteModal) => (
  <Modal isCentered isOpen={isOpen} onClose={onClose} size="md">
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Text fontSize="smm" fontWeight="bold">
          Delete message
        </Text>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody mb="40px">
        <Stack>
          <Text>Are you sure you want to delete the following message?</Text>
          <Text fontStyle="italic" fontWeight="bold">
            {reactStringReplace(message, /(@@@\([\w+( +\w+)*$]+\)\[[\w-]+\])/g, (match, i) => (
              <ChatMention key={i} tag={match} />
            ))}
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <HStack justify="center" spacing={4} w="full">
          <Button _hover={{ opacity: 0.7 }} onClick={onClose}>
            Cancel
          </Button>
          <Button
            _hover={{ opacity: 0.7 }}
            bg="responseChatConfirmDeleteModal.deleteButtonBg"
            color="responseChatConfirmDeleteModal.deleteButtonColor"
            onClick={async () => {
              onAction(messageId);
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

export const responseChatConfirmDeleteModalStyles = {
  responseChatConfirmDeleteModal: {
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
    deleteButtonBg: '#462AC4',
    deleteButtonColor: '#ffffff',
  },
};

export default ResponseChatConfirmDeleteModal;
