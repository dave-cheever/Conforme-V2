import { useMemo } from 'react';

import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, Stack, Text } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

import { useAuditContext } from '../../contexts/AuditProvider';
import useDevice from '../../hooks/useDevice';
import { IQuestionsCategory } from '../../interfaces/IQuestionsCategory';
import Icon from '../Icon';

function AuditNewQuestionModal({ isOpen, onClose }) {
  const { audit, questions, customQuestionsCategories, setSelectedQuestion } = useAuditContext();
  const device = useDevice();

  const enabledQuestionsCategories = useMemo(() => {
    if (audit.status === 'upcoming') return customQuestionsCategories;
    return customQuestionsCategories.filter(({ notBlockedAfterCompletion }) => notBlockedAfterCompletion);
  }, [audit.status, JSON.stringify(customQuestionsCategories)]);

  const countQuestionsLeft = (category: IQuestionsCategory) =>
    category.maxQuestionsNumber ? category.maxQuestionsNumber - (questions[category._id] || []).length : 1;

  return (
    <Modal
        data-id="030925-ff4020"
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        size={device === 'mobile' ? '3xl' : '2xl'}>
      <ModalContent data-id="030925-2683d3">
        <ModalHeader data-id="030925-884a6f">
          <Text data-id="030925-439621" fontSize="smm" fontWeight="semibold">
            Add items
          </Text>
          <ModalCloseButton data-id="030925-5f57c2" />
        </ModalHeader>
        <ModalBody data-id="030925-f1a94e" mb={['none', '40px']}>
          <Flex data-id="030925-a5ade4" justify="space-around" wrap="wrap">
            {enabledQuestionsCategories.map((category) => {
              const questionsLeft = countQuestionsLeft(category);
              const isDisabled = !questionsLeft;
              return (
                <Stack
                    _hover={{
                      bg: isDisabled ? 'auditNewQuestionModal.tile.bg.default' : 'auditNewQuestionModal.tile.bg.hover',
                    }}
                    align="center"
                    bgColor="auditNewQuestionModal.tile.bg.default"
                    cursor={isDisabled ? 'default' : 'pointer'}
                    data-id="030925-88a6ac"
                    flexShrink={0}
                    h="170px"
                    justify="center"
                    key={category._id}
                    mt={4}
                    onClick={() => {
                      if (isDisabled) return;
                      setSelectedQuestion({
                        _id: uuidv4(), // generate temporary id to save attachments using it and replace after saving the question and answer
                        type: 'text',
                        questionsCategoryId: category._id,
                        scope: {
                          type: 'audit',
                          _id: audit._id,
                        },
                      });
                      onClose();
                    }}
                    opacity={isDisabled ? 0.5 : 1}
                    rounded="10px"
                    spacing={4}
                    w="170px">
                  <Icon
                    data-id="030925-985ad0"
                    fill="auditNewQuestionModal.tile.icon.fill"
                    h="36px"
                    icon={category.icon}
                    stroke="auditNewQuestionModal.tile.icon.stroke"
                    w="36px" />
                  <Stack align="center" data-id="030925-47931b" spacing={0}>
                    <Text data-id="030925-15c7aa" fontSize="smm">{category.name}</Text>
                    {category.maxQuestionsNumber && <Text data-id="030925-d208b1" fontSize="smm">{questionsLeft ? `${questionsLeft} left` : 'Limit reached'}</Text>}
                  </Stack>
                </Stack>
              );
            })}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
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

export default AuditNewQuestionModal;
