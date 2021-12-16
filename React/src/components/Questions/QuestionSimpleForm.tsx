import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { IQuestionFormBase } from "../../interfaces/IQuestionFormBase";
import { questionHeader } from "../../utils/helpers";
import TextInput from "../Forms/TextInput";
import Checkbox from '../Forms/Checkbox';
import Textarea from '../Forms/Textarea';
import { useComplianceItemModalContext } from "../../contexts/ComplianceItemModalProvider";
import { useForm } from "react-hook-form";

const QuestionSimpleForm = ({
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
        label="Question title"
        variant="secondaryVariant"
        placeholder="e.g. where is the tv?"
        validations={{
          notEmpty: true,
        }}
      />
      <Textarea
        control={control}
        name="description"
        variant="secondaryVariant"
        label="Description"
      />
      <Checkbox
        control={control}
        name="required"
        variant="secondaryVariant"
        label="Answer is required"
      />
      <Flex justifyContent="space-between" mt='15px'>
        <Button
          bg="questionsSimple.form.button.primary.bg"
          color="questionsSimple.form.button.primary.font"
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
          bg="questionsSimple.form.button.secondary.bg"
          color="questionsSimple.form.button.secondary.font"
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

export default QuestionSimpleForm

export const questionSimpleFormStyles = {
  questionsSimple: {
    form: {
      icon: '#2B3236',
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
    },
  },
};
