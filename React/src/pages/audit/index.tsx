import {
  Button,
  HStack,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import AuditAnswer from '../../components/Audit/AuditAnswer';
import AuditDeleteQuestionModal from '../../components/Audit/AuditDeleteQuestionModal';
import AuditNewQuestionModal from '../../components/Audit/AuditNewQuestionModal';
import DocumentThumbnail from '../../components/Documents/DocumentThumbnail';
import { useAuditContext } from '../../contexts/AuditProvider';
import { ActionsIcon, EditIcon, Trashcan } from '../../icons';

const Audit = () => {
  const {
    audit,
    questionsCategories,
    customQuestionsCategories,
    questions,
    selectedQuestion,
    setSelectedQuestion,
  } = useAuditContext();
  const {
    isOpen: isNewQuestionModalOpen,
    onOpen: handleNewQuestionModalOpen,
    onClose: handleNewQuestionModalClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteQuestionModalOpen,
    onOpen: handleDeleteQuestionModalOpen,
    onClose: handleDeleteQuestionModalClose,
  } = useDisclosure();

  return (
    <Stack h={['fit-content', 'full']} w="full">
      <AuditNewQuestionModal
        isOpen={isNewQuestionModalOpen}
        onClose={handleNewQuestionModalClose}
      />
      <AuditDeleteQuestionModal
        isOpen={isDeleteQuestionModalOpen}
        onClose={() => {
          setSelectedQuestion(undefined);
          handleDeleteQuestionModalClose();
        }}
      />
      <HStack
        align="center"
        justify={['space-between', 'initial']}
        spacing={4}
        w="full"
      >
        <Text fontSize="xxl" fontWeight="semibold">
          Walk Items
        </Text>
        {!(selectedQuestion && !isDeleteQuestionModalOpen) &&
          audit.status === 'inProgress' &&
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
          {questionsCategories.map((category) => {
            const categoryQuestions = questions[category._id];
            if (!categoryQuestions) return null;

            return (
              <Stack key={category._id} spacing={4} w="full">
                <Text fontWeight="semibold">{category.name}</Text>
                <Stack>
                  {categoryQuestions.map((question) => (
                    <HStack
                      bgColor="auditItem.listItem.bg"
                      h="90px"
                      key={question._id}
                      p={4}
                      rounded="10px"
                    >
                      <Stack flexGrow={1} spacing={2}>
                        <Text fontSize="smm">{question.question}</Text>
                        <HStack>
                          <ActionsIcon
                            fill="transparent"
                            stroke="auditItem.listItem.action.icon"
                          />
                          <Text
                            color="auditItem.listItem.action.color"
                            fontSize="ssm"
                          >
                            {0} Actions
                          </Text>
                        </HStack>
                      </Stack>
                      <HStack>
                        {question.answer?.attachments?.map((attachment) => (
                          <DocumentThumbnail
                            document={attachment}
                            key={attachment.id}
                          />
                        ))}
                      </HStack>
                      {audit.status === 'inProgress' && (
                        <Stack>
                          <EditIcon
                            cursor="pointer"
                            onClick={() => setSelectedQuestion(question)}
                            stroke="auditItem.listItem.editIcon"
                          />
                          <Spacer />
                          <Trashcan
                            cursor="pointer"
                            onClick={() => {
                              setSelectedQuestion(question);
                              handleDeleteQuestionModalOpen();
                            }}
                            stroke="auditItem.listItem.deleteIcon"
                          />
                        </Stack>
                      )}
                    </HStack>
                  ))}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
      {selectedQuestion && !isDeleteQuestionModalOpen && (
        <AuditAnswer
          handleClose={() => setSelectedQuestion(undefined)}
          question={selectedQuestion}
        />
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
