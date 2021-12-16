import { IQuestionFormBase } from "../../interfaces/IQuestionFormBase"
import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { questionHeader } from "../../utils/helpers";
import TextInput from "../Forms/TextInput";
import Checkbox from '../Forms/Checkbox';
import { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import { useForm } from "react-hook-form";

const QuestionEmailForm = ({
  questionType,
  addQuestion,
  setShowQuestionForm }: IQuestionFormBase) => {

  const { complianceItem } = useComplianceItemModalContext();
  const {
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    mode: "all",
    defaultValues: {
      name: '',
      description: '',
      required: false,
    },
  });
  const questionName = watch('name');
  const questionAlreadyExist = (complianceItem.questions || []).findIndex(({ name }) => name === questionName) > -1;
  return (
    <>
      <Flex alignItems="center" mb='20px'>
        <Text fontWeight="bold" fontSize="smm">
          {questionHeader(questionType)}
        </Text>
      </Flex>
      <TextInput
        control={control}
        name="name"
        label="Question instructions (optional)"
        variant="secondaryVariant"
        placeholder="e.g. must be a company email"
        validations={{
          notEmpty: true,
          isEmail: true
        }}
      />
      <Checkbox
        control={control}
        name="required"
        variant="secondaryVariant"
        label="Answer is required"
      />
      <Flex justifyContent="space-between" mt='15px'>
        <Button
          bg="questionEmailForm.button.primary.bg"
          color="questionEmailForm.button.primary.font"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => {
            const question = getValues();
            addQuestion({ type: questionType, ...question });
            setShowQuestionForm(false);
          }}
          disabled={questionAlreadyExist || Object.keys(errors).length > 0 || !questionName}
          title={questionAlreadyExist ? "This question already exist" : ''}
        >
          Save question
        </Button>
        <Button
          bg="questionEmailForm.button.secondary.bg"
          color="questionEmailForm.button.secondary.font"
          opacity="0.5"
          fontSize="sm"
          fontWeight="medium"
          h="27px"
          p="17px"
          onClick={() => setShowQuestionForm(false)}
        >
          Cancel
        </Button>
      </Flex>
    </>
  )
}

export default QuestionEmailForm

export const questionEmailFormStyles = {
  questionEmailForm: {
    button: {
      primary: {
        bg: '#462AC4',
        font: '#FFFFFF',
      },
      secondary: {
        bg: '#9A9EA1',
        font: '#FFFFFF',
      },
    }
  }
}