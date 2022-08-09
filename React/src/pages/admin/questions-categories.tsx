import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, CheckboxGroup, Flex, Stack, Text, useToast } from '@chakra-ui/react';
// import { omit } from 'lodash';

import { availableOptions, toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import { default as Checkbox } from '../../components/Filters/FilterCheckBox';
import NumberInput from '../../components/Forms/NumberInput';
import TextInput from '../../components/Forms/TextInput';
import Toggle from '../../components/Forms/Toggle';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import { IQuestionsCategory } from '../../interfaces/IQuestionsCategory';

const GET_QUESTIONS_CATEGORIES = gql`
  query {
    questionsCategories {
      _id
      name
      withAnswers
      allowCustomQuestions
      maxQuestionsNumber
      notBlockedAfterCompletion
      useStatus
      showInInsights
      icon
      options {
        type
        name
        value
      }
      scope {
        module
      }
    }
  }
`;
const CREATE_QUESTIONS_CATEGORY = gql`
  mutation ($questionsCategory: QuestionsCategoryCreateInput!) {
    createQuestionsCategory(questionsCategory: $questionsCategory) {
      _id
    }
  }
`;
const UPDATE_QUESTIONS_CATEGORY = gql`
  mutation ($questionsCategoryInput: QuestionsCategoryModifyInput!) {
    updateQuestionsCategory(questionsCategoryInput: $questionsCategoryInput) {
      _id
    }
  }
`;
const DELETE_QUESTION_CATEGORY = gql`
  mutation ($_id: String!) {
    deleteQuestionsCategory(_id: $_id)
  }
`;

const defaultValues: Partial<IQuestionsCategory> = {
  _id: undefined,
  name: '',
  withAnswers: false,
  allowCustomQuestions: false,
  maxQuestionsNumber: 5,
  showInInsights: false,
  icon: '',
  scope: {
    module: 'audits',
  },
};

const QuestionsCategories = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_QUESTIONS_CATEGORIES);
  const [createFunction] = useMutation(CREATE_QUESTIONS_CATEGORY);
  const [updateFunction] = useMutation(UPDATE_QUESTIONS_CATEGORY);
  const [deleteFunction] = useMutation(DELETE_QUESTION_CATEGORY);
  const device = useDevice();
  const [sortType, setSortType] = useState('questionsCategory');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const getQuestionsCategories = (questionsCategoriesArray: IQuestionsCategory[]) => {
    if (!questionsCategoriesArray) return [];

    return [...questionsCategoriesArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [questionsCategories, setQuestionsCategories] = useState<IQuestionsCategory[]>(getQuestionsCategories(data?.questionsCategories));

  useEffect(() => {
    setQuestionsCategories(getQuestionsCategories(data?.questionsCategories));
  }, [data]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner') return (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');

      return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());
    };
    if (sortOrder) setQuestionsCategories([...questionsCategories].sort((a, b) => sort(a, b)));
    else setQuestionsCategories([...questionsCategories].sort((a, b) => sort(b, a)));
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  const questionsCategory = watch();

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  const onChangeOption = (values) => {
    setValue('options', [...values.map((value) => availableOptions[value])]);
  };

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openQuestionsCategoryModal = (action: 'edit' | 'delete', questionsCategory: IQuestionsCategory) => {
    setAdminModalState(action);
    reset({
      _id: questionsCategory?._id,
      name: questionsCategory?.name,
      withAnswers: questionsCategory?.withAnswers,
      allowCustomQuestions: questionsCategory?.allowCustomQuestions,
      maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
      notBlockedAfterCompletion: questionsCategory?.notBlockedAfterCompletion,
      useStatus: questionsCategory?.useStatus,
      showInInsights: questionsCategory?.showInInsights,
      icon: questionsCategory?.icon,
      options: questionsCategory?.options,
      scope: questionsCategory?.scope,
    });
  };

  const handleAddQuestionsCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        await createFunction({
          variables: {
            questionsCategory: {
              _id: questionsCategory?._id,
              name: questionsCategory?.name,
              withAnswers: questionsCategory?.withAnswers,
              allowCustomQuestions: questionsCategory?.allowCustomQuestions,
              maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
              showInInsights: questionsCategory?.showInInsights,
              icon: questionsCategory?.icon,
              options: questionsCategory?.options,
              scope: questionsCategory?.scope,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Questions category added' });
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

  const handleUpdateQuestionsCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        await updateFunction({
          variables: {
            questionsCategoryInput: {
              _id: questionsCategory?._id,
              name: questionsCategory?.name,
              withAnswers: questionsCategory?.withAnswers,
              allowCustomQuestions: questionsCategory?.allowCustomQuestions,
              maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
              notBlockedAfterCompletion: questionsCategory?.notBlockedAfterCompletion,
              useStatus: questionsCategory?.useStatus,
              showInInsights: questionsCategory?.showInInsights,
              icon: questionsCategory?.icon,
              options: questionsCategory?.options,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Questions category updated' });
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

  const handleDeleteQuestionsCategory = async () => {
    try {
      const { _id } = questionsCategory;
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: 'Questions category deleted' });
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
        handleAddQuestionsCategory();
        break;
      case 'edit':
        handleUpdateQuestionsCategory();
        break;
      case 'delete':
        handleDeleteQuestionsCategory();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const renderQuestionsCategoryRow = (questionsCategory: IQuestionsCategory, i: number) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === questionsCategories.length - 1 ? 'lg' : ''}
      boxShadow="sm"
      flexShrink={0}
      h="73px"
      key={questionsCategory._id}
      mb="1px"
      p={4}
      w="full"
    >
      <Flex cursor="pointer" flexDir="column" mr={4} onClick={() => openQuestionsCategoryModal('edit', questionsCategory)} pl={1} w="full">
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {questionsCategory.name}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        collection="questions categories"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
      >
        <Stack spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            control={control}
            label="Name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Toggle control={control} label="Allow answers" name="withAnswers" placeholder="Allow answers" variant="secondaryVariant" />
          <Toggle
            control={control}
            label="Allow custom questions"
            name="allowCustomQuestions"
            placeholder="Allow custom questions"
            variant="secondaryVariant"
          />
          <NumberInput
            control={control}
            label="Max number of questions"
            name="maxQuestionsNumber"
            placeholder="Max number of questions"
            required
            tooltip="0 means no limit"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            label="Editable after submission"
            name="notBlockedAfterCompletion"
            placeholder="Editable after submission"
            tooltip="If enabled, questions and answers in this category will be editable after submission"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            label="Use status"
            name="useStatus"
            placeholder="Use status"
            tooltip="If disabled, status will not show for associated answers"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            label="Show in insights"
            name="showInInsights"
            placeholder="Show in insights"
            tooltip="If enabled, answers related to this questions category will be shown in insights"
            variant="secondaryVariant"
          />
          <TextInput
            control={control}
            label="Icon"
            name="icon"
            placeholder="Icon"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Stack pt={2}>
            <Text fontSize="11px" fontWeight="bold">
              Options
            </Text>
            <CheckboxGroup defaultValue={questionsCategory.options?.map((option) => option.value)} onChange={onChangeOption}>
              {Object.values(availableOptions).map((option) => (
                <Checkbox key={option.value} label={option.name} value={option.value} />
              ))}
            </CheckboxGroup>
          </Stack>
        </Stack>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Questions categories']} mobileBreadcrumbs={['Questions categories']} />
      <Flex h="calc(100vh - 160px)" overflow="auto" px={['25px', 0]}>
        <Box h={['calc(100% - 90px)', 'calc(100% - 35px)']} p={[0, '0 25px 30px 30px']} w="full">
          <AdminTableHeader>
            <AdminTableHeaderElement
              label="Question Categories"
              onClick={() => {
                setSortType('questionCategory');
                setSortOrder(sortOrder === 'asc' && sortType === 'questionCategory' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'questionCategory'}
              sortOrder={sortType === 'questionCategory' ? sortOrder : undefined}
              w="full"
            />
          </AdminTableHeader>
          <Flex bg="white" borderBottomRadius="20px" flexDir="column" fontSize="smm" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader center />
            ) : questionsCategories?.length > 0 ? (
              questionsCategories?.map(renderQuestionsCategoryRow)
            ) : (
              <Flex fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                No questions categories found
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default QuestionsCategories;
