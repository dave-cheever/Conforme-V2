import { Button, HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import AuditAnswer from '../../components/Audit/AuditAnswer';
import AuditDeleteQuestionModal from '../../components/Audit/AuditDeleteQuestionModal';
import AuditNewQuestionModal from '../../components/Audit/AuditNewQuestionModal';
import AuditQuestionsCategory from '../../components/Audit/AuditQuestionsCategory';
import { useAuditContext } from '../../contexts/AuditProvider';

const Audit = () => {
  const { audit, questionsCategories, selectedQuestion, setSelectedQuestion, customQuestionsCategories } = useAuditContext();
  const { isOpen: isNewQuestionModalOpen, onOpen: handleNewQuestionModalOpen, onClose: handleNewQuestionModalClose } = useDisclosure();
  const {
    isOpen: isDeleteQuestionModalOpen,
    onOpen: handleDeleteQuestionModalOpen,
    onClose: handleDeleteQuestionModalClose,
  } = useDisclosure();

  return (
    <Stack h={['fit-content', 'full']} w="full">
      <AuditNewQuestionModal isOpen={isNewQuestionModalOpen} onClose={handleNewQuestionModalClose} />
      <AuditDeleteQuestionModal
        isOpen={isDeleteQuestionModalOpen}
        onClose={() => {
          setSelectedQuestion(undefined);
          handleDeleteQuestionModalClose();
        }}
      />
      <HStack align="center" justify={['space-between', 'initial']} spacing={4} w="full">
        <Text fontSize="xxl" fontWeight="semibold">
          {capitalize(pluralize(t('question')))}
        </Text>
        {!(selectedQuestion && !isDeleteQuestionModalOpen) &&
          (audit.status === 'inProgress' || questionsCategories.some(({ editableSubmitted }) => editableSubmitted)) &&
          customQuestionsCategories.length && (
            <Button
              bg="auditItem.addButton.bg"
              borderRadius="10px"
              color="auditItem.addButton.color"
              fontSize="ssm"
              h="28px"
              onClick={() => handleNewQuestionModalOpen()}
            >
              Add
            </Button>
          )}
      </HStack>
      {!(selectedQuestion && !isDeleteQuestionModalOpen) && (
        <Stack>
          {questionsCategories.map((category) => (
            <AuditQuestionsCategory handleDelete={handleDeleteQuestionModalOpen} key={category._id} questionsCategory={category} />
          ))}
        </Stack>
      )}
      {selectedQuestion && !isDeleteQuestionModalOpen && (
        <AuditAnswer handleClose={() => setSelectedQuestion(undefined)} question={selectedQuestion} />
      )}
    </Stack>
  );
};

export default Audit;

export const auditItemStyles = {
  auditItem: {
    addButton: {
      bg: '#DC0043',
      color: '#ffffff',
    },
    listItem: {
      bg: '#ffffff',
      action: {
        icon: '#D2D1D7',
        color: '#1E183650',
      },
      editIcon: '#1E1836',
      deleteIcon: '#DC0043',
    },
  },
};
