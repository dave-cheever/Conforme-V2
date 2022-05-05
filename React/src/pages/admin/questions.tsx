import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import Dropdown from '../../components/Forms/Dropdown';
import TextInput from '../../components/Forms/TextInput';
import TextInputMultiline from '../../components/Forms/TextInputMultiline';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import { IQuestion } from '../../interfaces/IQuestion';
import { TQuestionValue } from '../../interfaces/TQuestionValue';

const GET_QUESTIONS = gql`
  query ($questionQuery: QuestionQuery) {
    questions(questionQuery: $questionQuery) {
      _id
      type
      question
      description
      questionsCategoryId
      positiveValue
      negativeValue
      scope {
        component
      }
    }
    questionsCategories {
      _id
      name
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
  type: 'text',
  question: '',
  description: '',
  questionsCategoryId: '',
  positiveValue: null,
  negativeValue: null,
  scope: {
    component: 'audits',
  },
};

const Questions = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_QUESTIONS, {
    variables: {
      questionQuery: {
        scope: {
          component: 'audits',
        },
      },
    },
  });
  const [createFunction] = useMutation(CREATE_QUESTION);
  const [updateFunction] = useMutation(UPDATE_QUESTION);
  const [deleteFunction] = useMutation(DELETE_QUESTION);
  const device = useDevice();
  const [sortType, setSortType] = useState('question');
  const [sortOrder, setSortOrder] = useState(true);

  const getQuestions = (questionsArray: IQuestion<TQuestionValue>[]) => {
    if (!questionsArray) return [];

    return [...questionsArray].sort((a, b) =>
      (a.question || '').localeCompare(b.question || ''),
    );
  };
  const [questions, setQuestions] = useState<IQuestion<TQuestionValue>[]>(
    getQuestions(data?.questions),
  );

  useEffect(() => {
    setQuestions(getQuestions(data?.questions));
  }, [data]);

  const questionsCategories = data?.questionsCategories;

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner') {
        return (a.owner?.displayName || '').localeCompare(
          b.owner?.displayName || '',
        );
      }

      return (a[sortType] || 0)
        .toString()
        .localeCompare((b[sortType] || 0).toString());
    };
    if (sortOrder) setQuestions([...questions].sort((a, b) => sort(a, b)));
    else setQuestions([...questions].sort((a, b) => sort(b, a)));
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openQuestionModal = (
    action: 'edit' | 'delete',
    question: IQuestion<TQuestionValue>,
  ) => {
    setAdminModalState(action);
    reset({
      _id: question?._id,
      type: question?.type,
      question: question?.question,
      description: question?.description,
      questionsCategoryId: question?.questionsCategoryId,
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
        toast({ ...toastSuccess, description: 'Question added' });
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
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
              questionsCategoryId: question.questionsCategoryId,
              required: question.required,
              notApplicable: question.notApplicable,
              positiveValue: question.positiveValue,
              negativeValue: question.negativeValue,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Question updated' });
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const _id = getValues('_id');
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: 'Question deleted' });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (['add', 'edit'].includes(action) && !isFormValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }
    switch (action) {
      case 'add':
        handleAddQuestion();
        break;
      case 'edit':
        handleUpdateQuestion();
        break;
      case 'delete':
        handleDeleteQuestion();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const renderQuestionRow = (
    question: IQuestion<TQuestionValue>,
    i: number,
  ) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === questions.length - 1 ? 'lg' : ''}
      boxShadow="sm"
      flexShrink={0}
      h="73px"
      key={question._id}
      mb="1px"
      p={4}
      w="full"
    >
      <Flex
        cursor="pointer"
        flexDir="column"
        mr={4}
        onClick={() => openQuestionModal('edit', question)}
        pl={1}
        w="full"
      >
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {question.question}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        collection="questions"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
      >
        <Stack
          spacing={2}
          w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}
        >
          <Dropdown
            control={control}
            label="Questions Category"
            name="questionsCategoryId"
            options={questionsCategories?.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
            placeholder="Questions category"
            variant="secondaryVariant"
          />
          <TextInput
            control={control}
            label="Question"
            name="question"
            placeholder="Question"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline
            control={control}
            label="Description"
            name="description"
            placeholder="Description"
          />
          <TextInput
            control={control}
            label="Positive value"
            name="positiveValue"
            placeholder="Positive value"
          />
          <TextInput
            control={control}
            label="Negative value"
            name="negativeValue"
            placeholder="Negative value"
          />
        </Stack>
      </AdminModal>
      <Header
        breadcrumbs={['Admin', 'Questions']}
        mobileBreadcrumbs={['Questions']}
      />
      <Flex h="calc(100vh - 160px)" overflow="auto" px={['25px', 0]}>
        <Box
          h={['calc(100% - 90px)', 'calc(100% - 35px)']}
          p={[0, '0 25px 30px 30px']}
          w="full"
        >
          <AdminTableHeader>
            <AdminTableHeaderElement
              label="Question"
              onClick={() => {
                setSortType('question');
                setSortOrder(!sortOrder);
              }}
              showSortingIcon={sortType === 'question'}
              sortOrder={sortType === 'question' && !sortOrder}
              w="full"
            />
          </AdminTableHeader>
          <Flex
            bg="white"
            borderBottomRadius="20px"
            flexDir="column"
            fontSize="smm"
            h="full"
            overflow="auto"
            w="full"
          >
            {loading ? (
              <Loader center />
            ) : questions?.length > 0 ? (
              questions?.map(renderQuestionRow)
            ) : (
              <Flex
                fontSize="18px"
                fontStyle="italic"
                h="full"
                justify="center"
                mt={4}
                w="full"
              >
                No questions found
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Questions;
