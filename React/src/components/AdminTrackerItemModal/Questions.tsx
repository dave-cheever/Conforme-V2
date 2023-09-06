import { useState } from 'react';

import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Icon, Stack, Text, useRadioGroup, VStack } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { questionTypes } from '../../bootstrap/config';
import { useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import { OpenMenuArrow } from '../../icons';
import { ITrackerQuestion } from '../../interfaces/ITrackerQuestion';
import { TQuestionValue } from '../../interfaces/TQuestionValue';
import CustomRadioButton from '../CustomRadioButton';
import QuestionForm from '../Questions/QuestionForm';
import QuestionList from '../Questions/QuestionList';
import SectionHeader from './SectionHeader';

function QuestionsForm() {
  const { trackerItem, setValue } = useTrackerItemModalContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState<boolean>(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState<number>();
  const [editQuestion, setEditQuestion] = useState<ITrackerQuestion<TQuestionValue>>();

  const addOrUpdateQuestion = (question: ITrackerQuestion<TQuestionValue>) => {
    if (isEdit) {
      const questions = [...(trackerItem.questions || [])];
      if (typeof editQuestionIndex === 'number') {
        questions.splice(editQuestionIndex, 1, question);
        setValue('questions', questions);
      }
      setIsEdit(false);
      setEditQuestionIndex(undefined);
      setEditQuestion(undefined);
    } else {
      const questions = [...(trackerItem.questions || []), question];
      setValue('questions', questions);
    }
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'questions',
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  const group = getRootProps();

  return (
    (<Stack
      data-id="aea72f712f32"
      pb={isDragging ? 'calc(65px + .5rem)' : 0}
      spacing={4}
      w="full">
      <SectionHeader data-id="cbf13ff01e8b" label={`Add ${t('question')}`} />
      <Text
        color="adminTrackerItemModal.section.questions.description"
        data-id="59a366670f71"
        fontSize="11px"
        opacity="0.7">
        If you need to add any additional {pluralize(t('question'))} regarding this {t('tracker item')}, you can use this section to create
        them.
      </Text>
      {!showQuestionForm && (
        <Button
          _active={{
            bg: 'questionsModal.button.active',
          }}
          _hover={{
            bg: 'questionsModal.button.hover',
          }}
          bg="questionsModal.button.bg"
          color="questionsModal.button.color"
          data-id="72e9db869a7c"
          fontSize="11px"
          fontWeight="400"
          h="28px"
          leftIcon={<AddIcon data-id="ee5bfe093793" stroke="questionsModal.button.icon" />}
          mb={4}
          mt={trackerItem.evidenceItems?.length === 0 ? 0 : 3}
          onClick={() => setIsQuestionListOpen(!isQuestionListOpen)}
          px={4}
          py={2}
          w="120px">
          Add {t('question')}
        </Button>
      )}
      {isQuestionListOpen && (
        <Box
          bg="questionsModal.questionsList.bg"
          data-id="c65f2be79dd1"
          p="20px 25px"
          rounded="20px"
          textAlign="center"
          w="225px">
          <VStack
            data-id="708301a04356"
            {...group}
            alignItems="flex-start"
            mb="20px"
            spacing="20px">
            {questionTypes.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                (<CustomRadioButton data-id="7005311bc238" key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>)
              );
            })}
          </VStack>
          <Button
            _active={{
              bg: 'questionsModal.button.active',
            }}
            _hover={{
              bg: 'questionsModal.button.hover',
            }}
            bg="questionsModal.button.bg"
            color="questionsModal.button.color"
            data-id="95dddacc078a"
            disabled={selectedRadio === ''}
            fontSize="smm"
            fontWeight="700"
            h="40px"
            onClick={() => {
              setSelectedQuestionType(selectedRadio);
              setIsQuestionListOpen(!isQuestionListOpen);
              setShowQuestionForm(true);
              setSelectedRadio('');
            }}
            rightIcon={<Icon
              as={OpenMenuArrow}
              data-id="99b06336e3a7"
              stroke="questionsModal.button.icon"
              transform="rotate(270deg)" />}
            w="154px">
            Continue
          </Button>
        </Box>
      )}
      {showQuestionForm && (
        <QuestionForm
          addOrUpdateQuestion={addOrUpdateQuestion}
          data-id="e757d2b0733b"
          editQuestionIndex={editQuestionIndex}
          questionType={selectedQuestionType}
          setEditQuestion={setEditQuestion}
          setEditQuestionIndex={setEditQuestionIndex}
          setIsEdit={setIsEdit}
          setShowQuestionForm={setShowQuestionForm}
          value={editQuestion} />
      )}
      {!showQuestionForm && !isQuestionListOpen && (
        <QuestionList
          data-id="8244920bd844"
          disabled={false}
          handleChange={(questions) => setValue('questions', questions)}
          handleEdit={(index, item) => {
            setIsQuestionListOpen(false);
            setShowQuestionForm(true);
            setIsEdit(true);
            setEditQuestionIndex(index);
            setEditQuestion(item);
            setSelectedQuestionType(item?.type);
          }}
          setIsDragging={setIsDragging}
          trackerItem={trackerItem} />
      )}
    </Stack>)
  );
}

export default QuestionsForm;

export const questionsModalStyles = {
  questionsModal: {
    button: {
      bg: '#462AC4',
      hover: '#462AC4',
      active: '#462AC4',
      color: '#ffffff',
      icon: '#ffffff',
    },
    questionsList: {
      bg: '#ffffff',
    },
  },
};
