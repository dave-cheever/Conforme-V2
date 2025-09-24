import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import * as ChakraIcons from '@chakra-ui/icons';
import { Box, CheckboxGroup, Flex, FormLabel, Icon, Select, Stack, Text, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

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
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import { ChevronRight } from '../../icons';
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
      countInAuditCard
      icon
      options {
        type
        name
        setting
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
  countInAuditCard: false,
  icon: '',
  scope: {
    module: 'audits',
  },
};

function QuestionsCategories() {
  const toast = useToast();
  const { module } = useAppContext();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_QUESTIONS_CATEGORIES);
  const [createFunction] = useMutation(CREATE_QUESTIONS_CATEGORY);
  const [updateFunction] = useMutation(UPDATE_QUESTIONS_CATEGORY);
  const [deleteFunction] = useMutation(DELETE_QUESTION_CATEGORY);
  const device = useDevice();
  const [sortType, setSortType] = useState('questionsCategory');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const excludedIcons = ['AccordionIcon', 'createIcon', 'AlertIcon', 'CheckboxIcon', 'FormErrorIcon', 'ListIcon', 'MenuIcon', 'StepIcon'];

  const allIconNames = Object.keys(ChakraIcons)
    .filter((key) => key.endsWith('Icon') && !excludedIcons.includes(key))
    .sort((a, b) => a.localeCompare(b));

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
      return (a[sortType] || '').toString().localeCompare((b[sortType] || '').toString());
    };

    const sortedData = [...questionsCategories].sort((a, b) => (sortOrder === 'asc' ? sort(a, b) : sort(b, a)));
    setQuestionsCategories(sortedData);
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
    const options = availableOptions(!!module?.featureFlags?.enableSafetyWalk).filter(({ setting }) => values.includes(setting));
    setValue('options', options);
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
      countInAuditCard: questionsCategory?.countInAuditCard,
      icon: questionsCategory?.icon,
      options: (questionsCategory?.options || []).map(({ name, setting, type }) => ({ name, setting, type })),
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
              countInAuditCard: questionsCategory?.countInAuditCard,
              icon: questionsCategory?.icon,
              options: questionsCategory?.options,
              scope: questionsCategory?.scope,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Questions set added' });
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
              countInAuditCard: questionsCategory?.countInAuditCard,
              icon: questionsCategory?.icon,
              options: questionsCategory?.options,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: `${t('question')} set updated` });
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
      toast({ ...toastSuccess, description: `${t('question')} set deleted` });
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

  const handleAddAndResetQuestionsCategory = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    try {
      await createFunction({
        variables: {
          questionsCategory: {
            _id: questionsCategory?._id,
            name: questionsCategory?.name,
            withAnswers: questionsCategory?.withAnswers,
            allowCustomQuestions: questionsCategory?.allowCustomQuestions,
            maxQuestionsNumber: questionsCategory?.maxQuestionsNumber,
            showInInsights: questionsCategory?.showInInsights,
            countInAuditCard: questionsCategory?.countInAuditCard,
            icon: questionsCategory?.icon,
            options: questionsCategory?.options,
            scope: questionsCategory?.scope,
          },
        },
      });

      toast({ ...toastSuccess, description: 'Questions set added' });
      reset(defaultValues);
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const renderQuestionsCategoryRow = (questionsCategory: IQuestionsCategory, i: number) => {
    const rowBg = i % 2 === 0 ? 'white' : 'gray.50';
    return (
      <Flex
        data-id="000447"
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
        key={questionsCategory?._id}
        px={2}
        py={4}
        w="full"
      >
        <Flex
          data-id="000448"
          cursor="pointer"
          flexDir="column"
          mr={4}
          onClick={() => openQuestionsCategoryModal('edit', questionsCategory)}
          pl={1}
          w="full"
        >
          <Text data-id="000449" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {questionsCategory.name}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        data-id="000450"
        collection="questions categories"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestionsCategory : undefined}
      >
        <Stack data-id="000451" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            data-id="000452"
            control={control}
            label="Name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Toggle
            data-id="000453"
            control={control}
            label="Allow answers"
            name="withAnswers"
            placeholder="Allow answers"
            variant="secondaryVariant"
          />
          <Toggle
            data-id="000454"
            control={control}
            label="Allow custom questions"
            name="allowCustomQuestions"
            placeholder="Allow custom questions"
            variant="secondaryVariant"
          />
          <NumberInput
            data-id="000455"
            control={control}
            label="Max number of questions"
            name="maxQuestionsNumber"
            placeholder="Max number of questions"
            required
            tooltip="0 means no limit"
            variant="secondaryVariant"
          />
          <Toggle
            data-id="000456"
            control={control}
            label="Editable after submission"
            name="notBlockedAfterCompletion"
            placeholder="Editable after submission"
            tooltip="If enabled, questions and answers in this category will be editable after submission"
            variant="secondaryVariant"
          />
          <Toggle
            data-id="000457"
            control={control}
            label="Use status"
            name="useStatus"
            placeholder="Use status"
            tooltip="If disabled, status will not show for associated answers"
            variant="secondaryVariant"
          />
          <Toggle
            data-id="000458"
            control={control}
            label="Show in insights"
            name="showInInsights"
            placeholder="Show in insights"
            tooltip="If enabled, answers related to this questions category will be shown in insights"
            variant="secondaryVariant"
          />
          <Toggle
            data-id="000459"
            control={control}
            label="Count in audit card"
            name="countInAuditCard"
            placeholder="Count in audit card"
            tooltip={`If enabled, total of questions related to this question category will be displayed in ${t('audit')} card`}
            variant="secondaryVariant"
          />
          <Controller
            data-id="000460"
            control={control}
            name="icon"
            render={({ field }) => (
              <>
                <FormLabel
                  data-id="000461"
                  alignItems="center"
                  columnGap={1}
                  display={'flex'}
                  fontSize="12px"
                  fontWeight="regular"
                  mb={1}
                  >
                    Icon <Text
                  data-id="000462"
                  as="span"
                  color="#e93c44"
                  fontSize="22px"
                  fontWeight="bold"
                  mt={"12px"}>*</Text>
                  </FormLabel>

                <Select
                  data-id="000463"
                  {...field}
                  _active={{ bg: 'dropdown.activeBg' }}
                  _focus={{
                    borderColor: 'dropdown.border.focus.normal',
                  }}
                  _placeholder={{ color: 'dropdown.placeholder' }}
                  bg="dropdown.bg"
                  borderColor="dropdown.border.normal"
                  borderRadius="8px"
                  borderWidth="1px"
                  color="dropdown.font"
                  css={{ paddingTop: '0' }}
                  fontSize="smm"
                  h="42px"
                  icon={<ChevronRight data-id="000464" stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
                  mb={2}
                  placeholder="Select an icon"
                  variant="outline">
                  {allIconNames.map((iconName) => (
                    <option data-id="000465" key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </Select>
                {field.value && ChakraIcons[field.value] && (
                  <Flex data-id="000466" align="center" gap={2} mt={1}>
                    <Text data-id="000467" fontSize="sm">Preview:</Text>
                    <Icon data-id="000468" as={ChakraIcons[field.value] || ''} boxSize={4} />
                  </Flex>
                )}
              </>
            )}
            rules={{ required: 'Icon is required' }} />
          <Stack data-id="000469" pt={2}>
            <Text data-id="000470" fontSize="11px" fontWeight="bold">
              Options
            </Text>
            <CheckboxGroup
              data-id="000471"
              defaultValue={questionsCategory.options?.map((option) => option.setting)}
              onChange={onChangeOption}
            >
              {availableOptions(!!module?.featureFlags?.enableSafetyWalk).map((option) => (
                <Checkbox data-id="000472" key={option.setting} label={option.name} value={option.setting} />
              ))}
            </CheckboxGroup>
          </Stack>
        </Stack>
      </AdminModal>
      <Header
        data-id="000473"
        breadcrumbs={['Admin', 'Questions categories']}
        mobileBreadcrumbs={['Questions categories']}
        pageLabel={`${capitalize(t('question'))} set`}
      />
      <Flex
        data-id="000474"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={[0, '0 25px 30px 30px']}
      >
         <Flex data-id="000475" h="full" px={['25px', 0]} w="full">
          <Box
          data-id="000476"
          border="1px solid"
          borderColor="auditsList.headerBorderColor"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            overflow="hidden"
            w={['full', 'full', 'calc(100%)']}
        >
          <AdminTableHeader data-id="000477">
            <AdminTableHeaderElement
              data-id="000478"
              label="Question Categories"
              onClick={() => {
                setSortType('name'); // Change 'questionCategory' to 'name'
                setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'name'}
              sortOrder={sortType === 'name' ? sortOrder : undefined}
              w="full"
            />
          </AdminTableHeader>
          <Box data-id="000479" bg="auditsList.bg" borderBottomRadius="10px" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader data-id="000480" center />
            ) : questionsCategories?.length > 0 ? (
              questionsCategories?.map(renderQuestionsCategoryRow)
            ) : (
              <Flex data-id="000481" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                No questions categories found
              </Flex>
            )}
          </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default QuestionsCategories;
