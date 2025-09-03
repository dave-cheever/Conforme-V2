import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

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
        module
      }
    }
    questionsCategories {
      _id
      name
      maxQuestionsNumber
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
  mutation ($_id: ID!) {
    deleteQuestion(_id: $_id)
  }
`;

const defaultValues: Partial<IQuestion<TQuestionValue>> = {
  _id: undefined,
  type: 'text',
  question: '',
  description: '',
  questionsCategoryId: '',
  positiveValue: '',
  negativeValue: '',
  scope: {
    module: 'audits',
  },
};

function Questions() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_QUESTIONS, {
    variables: {
      questionQuery: {
        scope: {
          module: 'audits',
        },
      },
    },
  });
  const [createFunction] = useMutation(CREATE_QUESTION);
  const [updateFunction] = useMutation(UPDATE_QUESTION);
  const [deleteFunction] = useMutation(DELETE_QUESTION);
  const device = useDevice();
  const [sortType, setSortType] = useState('question');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getQuestions = (questionsArray: IQuestion<TQuestionValue>[]) => {
    if (!questionsArray) return [];

    return [...questionsArray].sort((a, b) => (a.question || '').localeCompare(b.question || ''));
  };
  const [questions, setQuestions] = useState<IQuestion<TQuestionValue>[]>(getQuestions(data?.questions));

  useEffect(() => {
    setQuestions(getQuestions(data?.questions));
  }, [data]);

  const questionsCategories = data?.questionsCategories;

  useEffect(() => {
    const sort = (a, b) => {
      const compareA = (a[sortType] || '').toString().toLowerCase();
      const compareB = (b[sortType] || '').toString().toLowerCase();

      if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    };

    setQuestions((prevQuestions) => [...prevQuestions].sort(sort));
  }, [sortType, sortOrder]);

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

  useEffect(() => {
    if (questionsCategories?.length === 1) {
      reset({
        ...getValues(),
        questionsCategoryId: questionsCategories[0]._id,
      });
    }
  }, [questionsCategories]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openQuestionModal = (action: 'edit' | 'delete', question: IQuestion<TQuestionValue>) => {
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
    if (isLoading) return;
    setIsLoading(true);
    const question = getValues();
    const questionCategory = questionsCategories?.find((cat) => cat._id === question.questionsCategoryId);
    const { maxQuestionsNumber: selectedCategoryMaxQuestions, name: selectedCategoryName } = questionCategory;
    const questionsNumberForSelectedCategory = questions.filter(
      (_question) => _question.questionsCategoryId === question.questionsCategoryId,
    ).length;
    if (selectedCategoryMaxQuestions - questionsNumberForSelectedCategory <= 0) {
      toast({
        ...toastFailed,
        description: `Cannot add more than  ${selectedCategoryMaxQuestions} ${selectedCategoryName} ${pluralize(
          'question',
          selectedCategoryMaxQuestions,
        )}`,
      });
      return;
    }
    try {
      if (Object.keys(errors).length === 0) {
        await createFunction({ variables: { question } });
        refetch();
        toast({ ...toastSuccess, description: `${t('question')} added` });
      } else {
        toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setIsLoading(false);
      setAdminModalState('closed');
    }
  };

  const handleUpdateQuestion = async () => {
    if (isLoading) return;
    setIsLoading(true);
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
      setIsLoading(false);
      setAdminModalState('closed');
    }
  };

  const handleDeleteQuestion = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const _id = getValues('_id');
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: 'Question deleted' });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setIsLoading(false);
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

  const handleAddAndResetQuestion = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    const question = getValues();
    const questionCategory = questionsCategories?.find((cat) => cat._id === question.questionsCategoryId);
    const { maxQuestionsNumber, name } = questionCategory;
    const questionsCountForCategory = questions.filter((q) => q.questionsCategoryId === question.questionsCategoryId).length;

    if (maxQuestionsNumber - questionsCountForCategory <= 0) {
      return toast({
        ...toastFailed,
        description: `Cannot add more than ${maxQuestionsNumber} ${name} ${pluralize('question', maxQuestionsNumber)}.`,
      });
    }

    try {
      await createFunction({ variables: { question } });
      toast({ ...toastSuccess, description: `${t('question')} added` });
      reset({ ...defaultValues });
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const renderQuestionRow = (question: IQuestion<TQuestionValue>, i: number) => {
    const rowBg = i % 2 === 0 ? 'white' : 'gray.50';
    return (
      <Flex
        data-id="030925-591522"
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={question._id}
        px={2}
        py={4}
        w="full"
      >
        <Flex
          data-id="030925-fd3ca0"
          cursor="pointer"
          flexDir="column"
          mr={4}
          onClick={() => openQuestionModal('edit', question)}
          pl={1}
          w="full"
        >
          <Text data-id="030925-161467" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {question.question}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        data-id="030925-04f5b4"
        collection="questions"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestion : undefined}
      >
        <Stack data-id="030925-771b39" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <Dropdown
            data-id="030925-ac223f"
            control={control}
            label="Questions Category"
            name="questionsCategoryId"
            options={questionsCategories?.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
            placeholder="Questions category"
            required
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant"
          />
          <TextInput
            data-id="030925-4561d2"
            control={control}
            label="Question"
            name="question"
            placeholder="Question"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline data-id="030925-6bec33" control={control} label="Description" name="description" placeholder="Description" />
          <TextInput data-id="030925-c625ca" control={control} label="Positive value" name="positiveValue" placeholder="Positive value" />
          <TextInput data-id="030925-7f62ef" control={control} label="Negative value" name="negativeValue" placeholder="Negative value" />
        </Stack>
      </AdminModal>
      <Header
        data-id="030925-f70b2f"
        breadcrumbs={['Admin', 'Questions']}
        mobileBreadcrumbs={['Questions']}
        pageLabel={capitalize(t('question'))}
      />
      <Flex
        data-id="030925-3b0ead"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        overflow="auto"
       p={[0, '0 25px 30px 30px']}
      >
       <Flex data-id="030925-4f7f64" h="full" px={['25px', 0]} w="full">
          <Box
          data-id="030925-3d6dac"
          border="1px solid"
          borderColor="auditsList.headerBorderColor"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
          overflow="hidden"
          w="full"
        >
          <AdminTableHeader data-id="030925-e72417">
            <AdminTableHeaderElement
              data-id="030925-7ef376"
              label="Question"
              onClick={() => {
                setSortType('question');
                setSortOrder(sortOrder === 'asc' && sortType === 'question' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'question'}
              sortOrder={sortType === 'question' ? sortOrder : undefined}
              w="full"
            />
          </AdminTableHeader>
          <Box data-id="030925-211171" bg="auditsList.bg" borderBottomRadius="10px" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader data-id="030925-cf6f47" center />
            ) : questions?.length > 0 ? (
              questions?.map(renderQuestionRow)
            ) : (
              <Flex data-id="030925-bc0efd" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                No questions found
              </Flex>
            )}
          </Box>
          </Box>
          </Flex>
      </Flex>
    </>
  );
}

export default Questions;
