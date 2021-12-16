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

import { IQuestion } from '../../interfaces/IQuestion';
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

  const questionTypes = [{
    value: "text",
    label: "Text input"
  }, {
    value: "toggle",
    label: "Yes / No answer"
  }, {
    value: "datePicker",
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

  const addQuestion = (question: IQuestion) => {
    const questions = [...(complianceItem.questions || []), question];
    setValue('questions', questions);
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "questions",
    value: selectedRadio,
    onChange: setSelectedRadio
  })

  const group = getRootProps();  

  return (
    <Stack w='full' spacing={4} pb={isDragging ? 'calc(65px + .5rem)' : 0}>
      <SectionHeader label="Add questions"/>
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
        leftIcon={<AddIcon />}
        _hover={{
          bg: 'questionsModal.button.hover'
        }}
        _active={{
          bg: 'questionsModal.button.active'
        }}
        onClick={() => setIsQuestionListOpen(!isQuestionListOpen)}
      >Add question</Button>} 
      {isQuestionListOpen && 
        <Box w="204px" p="20px 25px" bg="questionsModal.questionsList.bg" rounded="20px">
          <VStack {...group} alignItems="flex-start" mb="20px" spacing="20px">
            {questionTypes.map(({value, label}) => {
              const radio = getRadioProps({ value });
              return (
                <CustomRadioButton key={value} {...radio}>
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
            rightIcon={<Icon as={OpenMenuArrow} stroke="questionsModal.button.icon" transform="rotate(270deg)"/>}
            _hover={{
              bg: 'questionsModal.button.hover'
            }}
            _active={{
              bg: 'questionsModal.button.active'
            }}
            onClick={() => {
              setSelectedQuestionType(selectedRadio)
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
          addQuestion={addQuestion}
        />
      }
      {!showQuestionForm &&
        <QuestionList
          setIsDragging={setIsDragging}
          complianceItem={complianceItem}
          handleChange={questions => setValue('questions', questions)}
          disabled={false}
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
    questionsList :{
      bg: "#ffffff"
    }
  }
};
