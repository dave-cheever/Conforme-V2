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
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        data-id="9c031a686e68"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={question._id}
        p={4}
        w="full"
      >
        <Flex
          cursor="pointer"
          data-id="8743b484e5d2"
          flexDir="column"
          mr={4}
          onClick={() => openQuestionModal('edit', question)}
          pl={1}
          w="full"
        >
          <Text data-id="64222f997a92" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {question.question}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        collection="questions"
        data-id="125850428c46"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestion : undefined}
      >
        <Stack data-id="b6bb827943fc" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <Dropdown
            control={control}
            data-id="aec2e30b2f10"
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
            control={control}
            data-id="838152df7ef1"
            label="Question"
            name="question"
            placeholder="Question"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline control={control} data-id="46a14008f017" label="Description" name="description" placeholder="Description" />
          <TextInput control={control} data-id="ec54740e17f3" label="Positive value" name="positiveValue" placeholder="Positive value" />
          <TextInput control={control} data-id="b22cc52a8670" label="Negative value" name="negativeValue" placeholder="Negative value" />
        </Stack>
      </AdminModal>
      <Header
        breadcrumbs={['Admin', 'Questions']}
        data-id="fd41c88fa390"
        mobileBreadcrumbs={['Questions']}
        pageLabel={capitalize(t('question'))}
      />
      <Flex
        bg="auditsList.bg"
        borderRadius="10px"
        data-id="37f9704ed253"
        h="calc(100vh - 160px)"
        overflow="auto"
       p={[0, '0 25px 30px 30px']}
      >
       <Flex data-id="20781672a9a01" h="full" px={['25px', 0]} w="full">
          <Box
          border="1px solid"
          borderColor="auditsList.headerBorderColor"
          data-id="b1c3342b2a30"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
          w="full"
        >
          <AdminTableHeader data-id="b2e9e78efe45">
            <AdminTableHeaderElement
              data-id="af2c58e1ef04"
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
          <Box bg="auditsList.bg" borderBottomRadius="10px" data-id="85c701753503" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader center data-id="515105f6eb5d" />
            ) : questions?.length > 0 ? (
              questions?.map(renderQuestionRow)
            ) : (
              <Flex data-id="2f754733ddff" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
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
