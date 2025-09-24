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
      data-id="000239"
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      size="md">
      <ModalOverlay data-id="000240" />
      <ModalContent data-id="000241">
        <ModalHeader data-id="000242">
          <Text data-id="000243" fontSize="smm" fontWeight="bold">
            Delete message
          </Text>
          <ModalCloseButton data-id="000244" />
        </ModalHeader>
        <ModalBody data-id="000245" mb="40px">
          <Stack data-id="000246">
            <Text data-id="000247">Are you sure you want to delete the following message?</Text>
            <Text data-id="000248" fontStyle="italic" fontWeight="bold">
              {reactStringReplace(message, chatMentionRegExp, (match, i) => (
                <ChatMention data-id="000249" key={i} tag={match} />
              ))}
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter data-id="000250">
          <HStack data-id="000251" justify="center" spacing={4} w="full">
            <Button data-id="000252" _hover={{ opacity: 0.7 }} onClick={onClose}>
              Cancel
            </Button>
            <Button
              data-id="000253"
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
