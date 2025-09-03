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

import { chatMentionRegExp } from '../utils/regular-expressions';
import ChatMention from './ChatMention';

interface IChatConfirmDeleteModal {
  isOpen: boolean;
  messageId: string;
  message: string;
  onClose: () => void;
  onAction: (id: string) => void;
}

function ChatConfirmDeleteModal({ isOpen, messageId, message, onClose, onAction }: IChatConfirmDeleteModal) {
  return (
    <Modal
      data-id="030925-cee20b"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="md">
      <ModalOverlay data-id="030925-ba4828" />
      <ModalContent data-id="030925-bfcc78">
        <ModalHeader data-id="030925-e0e16c">
          <Text data-id="030925-10cc7e" fontSize="smm" fontWeight="bold">
            Delete message
          </Text>
          <ModalCloseButton data-id="030925-451bc9" />
        </ModalHeader>
        <ModalBody data-id="030925-f705a2" mb="40px">
          <Stack data-id="030925-233730">
            <Text data-id="030925-05e0f1">Are you sure you want to delete the following message?</Text>
            <Text data-id="030925-cc3304" fontStyle="italic" fontWeight="bold">
              {reactStringReplace(message, chatMentionRegExp, (match, i) => (
                <ChatMention data-id="030925-a8edc4" key={i} tag={match} />
              ))}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="030925-fe6b13">
          <HStack data-id="030925-0da5bd" justify="center" spacing={4} w="full">
            <Button data-id="030925-d34ac6" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="030925-570f09"
              _hover={{ opacity: 0.7 }}
              bg="chatConfirmDeleteModal.deleteButtonBg"
              color="chatConfirmDeleteModal.deleteButtonColor"
              onClick={async () => {
                onAction(messageId);
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

export const chatConfirmDeleteModalStyles = {
  chatConfirmDeleteModal: {
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

export default ChatConfirmDeleteModal;
