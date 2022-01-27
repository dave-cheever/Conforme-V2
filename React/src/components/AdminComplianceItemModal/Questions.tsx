import { useState } from 'react';
import {
  Icon,
  Button,
  Stack,
  Text,
  Box,
  VStack,
  useRadioGroup,
} from '@chakra-ui/react';

import { IQuestion, IQuestionValue } from '../../interfaces/IQuestion';
import QuestionForm from '../Questions/QuestionForm';
import QuestionList from '../Questions/QuestionList';
import { useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import SectionHeader from './SectionHeader';
import { AddIcon } from '@chakra-ui/icons';
import { OpenMenuArrow } from '../../icons';
import CustomRadioButton from '../CustomRadioButton';

const QuestionsForm = () => {
  const {
    complianceItem,
    setValue,
  } = useComplianceItemModalContext();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showQuestionForm, setShowQuestionForm] = useState<boolean>(false);
  const [isQuestionListOpen, setIsQuestionListOpen] = useState<boolean>(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>("");
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editQuestionIndex, setEditQuestionIndex] = useState<number>();
  const [editQuestion, setEditQuestion] = useState<IQuestion<IQuestionValue>>();

  const questionTypes = [{
    value: "textConfirm",
    label: "Text input"
  }, {
    value: "textMultilineConfirm",
    label: "Multiple lines of text"
  }, {
    value: "switch",
    label: "Yes / No answer"
  }, {
    value: "datepicker",
    label: "Date input"
  }, {
    value: "multipleChoice",
    label: "Multiple choices"
  },
    // {
    //   value: "singleChoice",
    //   label: "Single choice"
    // }, 
    // {
    //   value: "email",
    //   label: "Email address"
    // }, 
    // {
    //   value: "phoneNumber",
    //   label: "Phone number"
    // }, {
    //   value: "url",
    //   label: "URL"
    // }
    // {
    //   value: "numeric",
    //   label: "Numeric"
    // }
  ];

  const addOrUpdateQuestion = (question: IQuestion<IQuestionValue>) => {
    if (isEdit) {
      const questions = [...(complianceItem.questions || [])];
      if (typeof editQuestionIndex === "number") {
        questions.splice(editQuestionIndex, 1, question);
        setValue('questions', questions);
      }
      setIsEdit(false);
      setEditQuestionIndex(undefined);
      setEditQuestion(undefined);
    } else {
      const questions = [...(complianceItem.questions || []), question];
      setValue('questions', questions);
    }
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "questions",
    value: selectedRadio,
    onChange: setSelectedRadio,
  });

  const group = getRootProps();

  return (
    <Stack w='full' spacing={4} pb={isDragging ? 'calc(65px + .5rem)' : 0}>
      <SectionHeader label="Add questions" />
      <Text fontSize='11px' color='adminComplianceItemModal.section.questions.description' opacity='0.7'>
        If you need to add any additional questions regarding this compliance item, you can use this section to create them.
      </Text>
      {!showQuestionForm && <Button
        w="120px"
        h="28px"
        mt={complianceItem.evidenceItems?.length === 0 ? 0 : 3}
        mb={4}
        px={4}
        bg="questionsModal.button.bg"
        color='questionsModal.button.color'
        fontSize="11px"
        fontWeight='400'
        leftIcon={<AddIcon stroke="questionsModal.button.icon" />}
        _hover={{
          bg: 'questionsModal.button.hover'
        }}
        _active={{
          bg: 'questionsModal.button.active'
        }}
        onClick={() => setIsQuestionListOpen(!isQuestionListOpen)}
      >Add question</Button>}
      {isQuestionListOpen &&
        <Box w="225px" p="20px 25px" bg="questionsModal.questionsList.bg" rounded="20px" textAlign="center" >
          <VStack {...group} alignItems="flex-start" mb="20px" spacing="20px">
            {questionTypes.map(({ value, label }) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton key={value} {...radio} fontSize="smm">
                  {label}
                </CustomRadioButton>
              )
            })}
          </VStack>
          <Button
            w="154px"
            h="40px"
            bg='questionsModal.button.bg'
            color='questionsModal.button.color'
            fontSize="smm"
            fontWeight='700'
            disabled={selectedRadio === ""}
            rightIcon={<Icon as={OpenMenuArrow} stroke="questionsModal.button.icon" transform="rotate(270deg)" />}
            _hover={{
              bg: 'questionsModal.button.hover'
            }}
            _active={{
              bg: 'questionsModal.button.active'
            }}
            onClick={() => {
              setSelectedQuestionType(selectedRadio);
              setIsQuestionListOpen(!isQuestionListOpen);
              setShowQuestionForm(true);
              setSelectedRadio("");
            }}
          >Continue</Button>
        </Box>
      }
      {showQuestionForm &&
        <QuestionForm
          setShowQuestionForm={setShowQuestionForm}
          questionType={selectedQuestionType}
          addOrUpdateQuestion={addOrUpdateQuestion}
          value={editQuestion}
          setIsEdit={setIsEdit}
          editQuestionIndex={editQuestionIndex}
          setEditQuestionIndex={setEditQuestionIndex}
          setEditQuestion={setEditQuestion}
        />
      }
      {!showQuestionForm &&
        <QuestionList
          setIsDragging={setIsDragging}
          complianceItem={complianceItem}
          handleChange={questions => setValue('questions', questions)}
          disabled={false}
          handleEdit={(index, item) => {
            setIsQuestionListOpen(false);
            setShowQuestionForm(true);
            setIsEdit(true);
            setEditQuestionIndex(index);
            setEditQuestion(item);
            setSelectedQuestionType(item?.type);
          }}
        />
      }
    </Stack>
  );
};

export default QuestionsForm;

export const questionsModalStyles = {
  questionsModal: {
    button: {
      bg: "#462AC4",
      hover: "#462AC4",
      active: "#462AC4",
      color: "#ffffff",
      icon: "#ffffff"
    },
    questionsList: {
      bg: "#ffffff"
    }
  }
};
