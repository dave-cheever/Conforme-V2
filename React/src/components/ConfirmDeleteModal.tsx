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

const ChatConfirmDeleteModal = ({ isOpen, messageId, message, onClose, onAction }: IChatConfirmDeleteModal) => (
  <Modal
    data-id="d8b4245cc0be"
    isCentered
    isOpen={isOpen}
    onClose={onClose}
    size="md">
    <ModalOverlay data-id="77e3a1713738" />
    <ModalContent data-id="212840a37c79">
      <ModalHeader data-id="6435addac411">
        <Text data-id="a76aa21e1e1f" fontSize="smm" fontWeight="bold">
          Delete message
        </Text>
        <ModalCloseButton data-id="9cb0cbaa3d2a" />
      </ModalHeader>
      <ModalBody data-id="8d7ac56e4dee" mb="40px">
        <Stack data-id="072fba718bca">
          <Text data-id="082dde04f6ac">Are you sure you want to delete the following message?</Text>
          <Text data-id="58886c3b3bce" fontStyle="italic" fontWeight="bold">
            {reactStringReplace(message, chatMentionRegExp, (match, i) => (
              <ChatMention data-id="e532a2c3ea2a" key={i} tag={match} />
            ))}
          </Text>
        </Stack>
      </ModalBody>
      <ModalFooter data-id="7dcbd6b38912">
        <HStack data-id="b786c4d797dc" justify="center" spacing={4} w="full">
          <Button _hover={{ opacity: 0.7 }} data-id="b3266b9d0c95" onClick={onClose}>
            Cancel
          </Button>
          <Button
            _hover={{ opacity: 0.7 }}
            bg="chatConfirmDeleteModal.deleteButtonBg"
            color="chatConfirmDeleteModal.deleteButtonColor"
            data-id="01c4dd63f091"
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
