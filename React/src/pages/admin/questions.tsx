import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, useToast, Stack } from "@chakra-ui/react";

import Loader from "../../components/Loader";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Header from "../../components/Header";
import { IQuestion } from "../../interfaces/IQuestion";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import useDevice from "../../hooks/useDevice";
import { TQuestionValue } from "../../interfaces/TQuestionValue";
import TextInputMultiline from "../../components/Forms/TextInputMultiline";


const GET_QUESTIONS = gql`
  query {
    questions {
      _id
      type
      question
      scope {
        component
      }
    }
  }
`;
const CREATE_QUESTION = gql`
  mutation ($question: QuestionCreateInput!) {
    createQuestion(question: $question) {
      _id
    }
  }
`;
const UPDATE_QUESTION = gql`
  mutation ($questionInput: QuestionModifyInput!) {
    updateQuestion(questionInput: $questionInput) {
      _id
    }
  }
`;
const DELETE_QUESTION = gql`
  mutation ($_id: String!) {
    deleteQuestion(_id: $_id)
  }
`;

const defaultValues: Partial<IQuestion<TQuestionValue>> = {
  _id: undefined,
  type: "text",
  question: "",
  description: "",
  category: "",
  positiveValue: null,
  negativeValue: null,
  scope: {
    component: 'audits',
  }
};

const Questions = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_QUESTIONS);
  const [createFunction] = useMutation(CREATE_QUESTION);
  const [updateFunction] = useMutation(UPDATE_QUESTION);
  const [deleteFunction] = useMutation(DELETE_QUESTION);
  const device = useDevice();
  const [sortType, setSortType] = useState("question");
  const [sortOrder, setSortOrder] = useState(true);

  const getQuestions = (questionsArray: IQuestion<TQuestionValue>[]) => {
    if (!questionsArray) {
      return [];
    }
    return [...questionsArray].sort((a, b) => a.question.localeCompare(b.question));
  }
  const [questions, setQuestions] = useState<IQuestion<TQuestionValue>[]>(getQuestions(data?.questions));

  useEffect(() => {
    setQuestions(getQuestions(data?.questions));
  }, [data]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner')
        return (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');
      else {
        return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());
      }
    };
    if (sortOrder) {
      setQuestions([...questions].sort((a, b) => sort(a, b)));
    }
    else {
      setQuestions([...questions].sort((a, b) => sort(b, a)));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openQuestionModal = (
    action: "edit" | "delete",
    question: IQuestion<TQuestionValue>,
  ) => {
    setAdminModalState(action);
    reset({
      _id: question?._id,
      type: question?.type,
      question: question?.question,
      description: question?.description,
      category: question?.category,
      positiveValue: question?.positiveValue,
      negativeValue: question?.negativeValue,
      scope: question?.scope,
    });
  };

  const handleAddQuestion = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const question = getValues();
        await createFunction({ variables: { question } });
        refetch();
        toast({ ...toastSuccess, description: "Question added" });
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const question = getValues();
        await updateFunction({
          variables: {
            questionInput: {
              _id: question._id,
              question: question.question,
              description: question.description,
              category: question.category,
              required: question.required,
              notApplicable: question.notApplicable,
              positiveValue: question.positiveValue,
              negativeValue: question.negativeValue,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: "Question updated" });
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const _id = getValues('_id');
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: "Question deleted" });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (["add", "edit"].includes(action) && !isFormValid) {
      return toast({
        ...toastFailed,
        description: "Please complete all the required fields",
      });
    }
    switch (action) {
      case "add":
        handleAddQuestion();
        break;
      case "edit":
        handleUpdateQuestion();
        break;
      case "delete":
        handleDeleteQuestion();
        break;
      default:
        setAdminModalState("closed");
    }
  };

  const renderQuestionRow = (question: IQuestion<TQuestionValue>, i: number) => (
    <Flex
      key={question._id}
      w='full'
      h='73px'
      bg='#FFFFFF'
      mb="1px"
      p={4}
      alignItems='center'
      borderBottomRadius={(i === questions.length - 1) ? 'lg' : ''}
      boxShadow="sm"
      flexShrink={0}
    >
      <Flex
        w='full'
        flexDir="column"
        pl={1}
        mr={4}
        cursor="pointer"
        onClick={() => openQuestionModal('edit', question)}
      >
        <Text
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{question.question}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"questions"}
      >
        <Stack w={device === 'mobile' ? 'full' : "calc(100% - 150px)"} spacing={2}>
          <TextInput
            name="question"
            label="Question"
            placeholder='Question'
            control={control}
            required={true}
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline
            name="description"
            label="Description"
            placeholder='Description'
            control={control}
          />
          <TextInput
            name="positiveValue"
            label="Positive value"
            placeholder='Positive value'
            control={control}
          />
          <TextInput
            name="negativeValue"
            label="Negative value"
            placeholder='Negative value'
            control={control}
          />
        </Stack>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Questions"]} mobileBreadcrumbs={["Questions"]} />
      <Flex h='calc(100vh - 160px)' px={["25px", 0]} overflow="auto">
        <Box w='full' h={['calc(100% - 90px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w='full' label="Question" onClick={() => { setSortType("question"); setSortOrder(!sortOrder); }} sortOrder={sortType === "question" && !sortOrder} showSortingIcon={sortType === "question"} />
          </AdminTableHeader>
          <Flex h="full" bg="white" flexDir="column" overflow="auto" w='full' borderBottomRadius="20px" fontSize="smm">
            {loading ? <Loader center={true} /> : (questions?.length > 0 ? questions?.map(renderQuestionRow) : (
              <Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
                No questions found
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Questions;
