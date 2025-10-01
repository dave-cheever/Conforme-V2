import { useEffect } from 'react';

import { Box, Button, HStack, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';
import queryString from 'query-string';

import AuditAnswer from '../../components/Audit/AuditAnswer';
import AuditDeleteQuestionModal from '../../components/Audit/AuditDeleteQuestionModal';
import AuditNewQuestionModal from '../../components/Audit/AuditNewQuestionModal';
import AuditQuestionsCategory from '../../components/Audit/AuditQuestionsCategory';
import { isPermitted } from '../../components/can';
import { useAppContext } from '../../contexts/AppProvider';
import { TQuestionWithAnswer, useAuditContext } from '../../contexts/AuditProvider';

function Audit() {
  const { user } = useAppContext();
  const { audit, questions, questionsCategories, selectedQuestion, setSelectedQuestion, customQuestionsCategories, refetch } =
    useAuditContext();
  const { isOpen: isNewQuestionModalOpen, onOpen: handleNewQuestionModalOpen, onClose: handleNewQuestionModalClose } = useDisclosure();
  const {
    isOpen: isDeleteQuestionModalOpen,
    onOpen: handleDeleteQuestionModalOpen,
    onClose: handleDeleteQuestionModalClose,
  } = useDisclosure();
  const queryStringParams = queryString.parse(window.location.search);

  useEffect(() => {
    if (Object.keys(queryStringParams).length > 0) {
      const question = Object.entries(questions).reduce((acc, [, questions]) => {
        const q = questions.find((question) => question._id === queryStringParams.questionId);
        if (q) return q;
        return acc;
      }, {} as TQuestionWithAnswer);
      setSelectedQuestion(question);
    }
  }, [JSON.stringify(queryStringParams), JSON.stringify(questions)]);

  return (
    <Stack border="1px solid #CBD5E0" data-id="000663"  h={['fit-content', 'full']} p="10px" rounded="10px" w="full">
      <AuditNewQuestionModal
        data-id="000664"
        isOpen={isNewQuestionModalOpen}
        onClose={handleNewQuestionModalClose} />
      <AuditDeleteQuestionModal
        data-id="000665"
        isOpen={isDeleteQuestionModalOpen}
        onClose={() => {
          setSelectedQuestion(undefined);
          handleDeleteQuestionModalClose();
        }} />
      <HStack
        align="center"
        data-id="000666"
        justify={['space-between', 'initial']}
        spacing={4}
        w="full">
        <Text data-id="000667" fontSize={["20px", "xxl"]} fontWeight="semibold">
          {capitalize(pluralize(t('question')))}
        </Text>
        {!(selectedQuestion && !isDeleteQuestionModalOpen) &&
          (audit?.status === 'upcoming' || questionsCategories.some(({ notBlockedAfterCompletion }) => notBlockedAfterCompletion)) &&
          isPermitted({ user, action: 'audits.edit', data: { audit } }) &&
          customQuestionsCategories.length && (
            <Button
              bg="auditItem.addButton.bg"
              borderRadius="10px"
              color="auditItem.addButton.color"
              data-id="000668"
              fontSize="ssm"
              h="28px"
              onClick={() => handleNewQuestionModalOpen()}>
              Add
            </Button>
          )}
      </HStack>
      {!(selectedQuestion && !isDeleteQuestionModalOpen && Object.entries(questions).length > 0) ? (
        selectedQuestion || Object.entries(questions).length > 0 ? (
          <Stack
            data-id="000669"
            overflow="auto"
            pb="25px"
            spacing={4}
            w="calc(100% + 10px)">
            {questionsCategories.map((category) => (
              <AuditQuestionsCategory
                data-id="000670"
                handleDelete={handleDeleteQuestionModalOpen}
                key={category._id}
                questionsCategory={category} />
            ))}
          </Stack>
        ) : (
          <Box
            bg="white"
            data-id="000671"
            fontSize="18px"
            fontStyle="italic"
            h="auto"
            px={6}
            py={6}
            rounded="20px"
            w="full">
            <Text data-id="000672">No {pluralize(t('question'))} found</Text>
          </Box>
        )
      ) : ''}
      {selectedQuestion && !isDeleteQuestionModalOpen && (
        <AuditAnswer
          data-id="000673"
          handleClose={() => {
            refetch();
            setSelectedQuestion(undefined);
          }}
          question={selectedQuestion} />
      )}
    </Stack>
  );
}

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
