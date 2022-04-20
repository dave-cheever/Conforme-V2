import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  Text,
} from '@chakra-ui/react';

import { useAuditContext } from '../../contexts/AuditProvider';
import { IQuestionsCategory } from '../../interfaces/IQuestionsCategory';
import Icon from '../Icon';

const AuditNewQuestionModal = ({ isOpen, onClose }) => {
  const { questions, questionsCategories, addCustomQuestionAndAnswer } =
    useAuditContext();

  const countQuestionsLeft = (category: IQuestionsCategory) =>
    category.maxQuestionsNumber - (questions[category._id] || []).length;

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>
          <Text fontSize="smm" fontWeight="semibold">
            Add items
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody mb="40px">
          <Flex justify="space-around" wrap="wrap">
            {questionsCategories.map((category) => (
              <Stack
                _hover={{
                  bg: 'auditNewQuestionModal.tile.bg.hover',
                }}
                align="center"
                bgColor="auditNewQuestionModal.tile.bg.default"
                cursor="pointer"
                flexShrink={0}
                h="170px"
                justify="center"
                key={category._id}
                mt={4}
                onClick={() => {
                  addCustomQuestionAndAnswer({
                    type: 'text',
                    questionsCategoryId: category._id,
                  });
                  onClose();
                }}
                rounded="10px"
                spacing={4}
                w="170px"
              >
                <Icon
                  fill="auditNewQuestionModal.tile.icon.fill"
                  h="36px"
                  icon={category.icon}
                  stroke="auditNewQuestionModal.tile.icon.stroke"
                  w="36px"
                />
                <Stack align="center" spacing={0}>
                  <Text fontSize="smm">{category.name}</Text>
                  {category.maxQuestionsNumber && (
                    <Text fontSize="smm">
                      {countQuestionsLeft(category)} left
                    </Text>
                  )}
                </Stack>
              </Stack>
            ))}
          </Flex>
        </ModalBody>
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

export default AuditNewQuestionModal;
