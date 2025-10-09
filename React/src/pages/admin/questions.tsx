import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import Dropdown from '../../components/Forms/Dropdown';
import TextInput from '../../components/Forms/TextInput';
import TextInputMultiline from '../../components/Forms/TextInputMultiline';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import { IQuestion } from '../../interfaces/IQuestion';
import { TQuestionValue } from '../../interfaces/TQuestionValue';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';

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

  const columns: ColumnConfig[] = [
    {
      label: 'Question',
      sortKey: 'question',
      width: '100%',
      dataId: '000497',
      render: (q: IQuestion<TQuestionValue>) => (
        <TextOrNumberCell data-id="002097" text={q.question} />
      ),
    },
  ];

  return (
    <>
      <AdminModal
        collection="questions"
        data-id="000485"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestion : undefined}
      >
        <Stack data-id="000486" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <Dropdown
            control={control}
            data-id="000487"
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
            data-id="000488"
            label="Question"
            name="question"
            placeholder="Question"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline control={control} data-id="000489" label="Description" name="description" placeholder="Description" />
          <TextInput control={control} data-id="000490" label="Positive value" name="positiveValue" placeholder="Positive value" />
          <TextInput control={control} data-id="000491" label="Negative value" name="negativeValue" placeholder="Negative value" />
        </Stack>
      </AdminModal>
      <Header
        breadcrumbs={['Admin', 'Questions']}
        data-id="000492"
        mobileBreadcrumbs={['Questions']}
        pageLabel={capitalize(t('question'))}
      />
      <Box bg="auditsList.bg" data-id="000493" h="full" overflow="hidden">
        <Flex data-id="000494" h="full" px={['25px', 0]}>
          {loading ? (
            <Box bg="white" borderBottomRadius="10px" data-id="000499" h="full" w="full">
              <Loader data-id="001947" center />
            </Box>
          ) : (
            <ListView
              columns={columns}
              data={questions}
              data-id="000444"
              dataType="questions"
              onRowClick={(row: IQuestion<TQuestionValue>) => openQuestionModal('edit', row)}
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          )}
        </Flex>
      </Box>
    </>
  );
}

export default Questions;
