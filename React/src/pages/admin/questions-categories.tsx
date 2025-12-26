import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import * as ChakraIcons from '@chakra-ui/icons';
import { Box, CheckboxGroup, Flex, FormLabel, Icon, Select, Stack, Text, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';

import { availableOptions, toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import { default as Checkbox } from '../../components/Filters/FilterCheckBox';
import NumberInput from '../../components/Forms/NumberInput';
import TextInput from '../../components/Forms/TextInput';
import Toggle from '../../components/Forms/Toggle';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
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
  const openQuestionsCategoryModal = useCallback((action: 'edit' | 'delete', questionsCategory: IQuestionsCategory) => {
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
  }, [setAdminModalState, reset]);

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
        toast({ ...toastSuccess, description: `${t('question')} set added` });
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

      toast({ ...toastSuccess, description: `${t('question')} set added` });
      reset(defaultValues);
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const handleRowClick = useCallback((row: IQuestionsCategory) => {
    openQuestionsCategoryModal('edit', row);
  }, [openQuestionsCategoryModal]);

  const columns: ColumnConfig[] = useMemo(() => [
    {
      label: `${capitalize(t('question'))} sets`,
      sortKey: 'name',
      width: '100%',
      dataId: '000478',
      render: (qc: IQuestionsCategory) => <TextOrNumberCell data-id="002096" text={qc.name} />,
    },
  ], [t]);

  const renderContent = () => {
    if (loading) {
      return (
        <Box bg="white" borderBottomRadius="10px" data-id="000480" h="full" w="full">
          <Loader center data-id="000480" />
        </Box>
      );
    }

    return (
      <ListView
        columns={columns}
        data={questionsCategories}
        data-id="000479"
        onRowClick={handleRowClick}
        setSortOrder={setSortOrder}
        setSortType={setSortType}
        sortOrder={sortOrder}
        sortType={sortType}
      />
    );
  };

  return (
    <>
      <AdminModal
        collection={`${t('question')} sets`}
        data-id="000450"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestionsCategory : undefined}
      >
        <Stack data-id="000451" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            control={control}
            data-id="000452"
            label="Name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Toggle
            control={control}
            data-id="000453"
            label="Allow answers"
            name="withAnswers"
            placeholder="Allow answers"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="000454"
            label="Allow custom questions"
            name="allowCustomQuestions"
            placeholder="Allow custom questions"
            variant="secondaryVariant"
          />
          <NumberInput
            control={control}
            data-id="000455"
            label="Max number of questions"
            name="maxQuestionsNumber"
            placeholder="Max number of questions"
            required
            tooltip="0 means no limit"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="000456"
            label="Editable after submission"
            name="notBlockedAfterCompletion"
            placeholder="Editable after submission"
            tooltip="If enabled, questions and answers in this category will be editable after submission"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="000457"
            label="Use status"
            name="useStatus"
            placeholder="Use status"
            tooltip="If disabled, status will not show for associated answers"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="000458"
            label="Show in insights"
            name="showInInsights"
            placeholder="Show in insights"
            tooltip="If enabled, answers related to this questions category will be shown in insights"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="000459"
            label="Count in audit card"
            name="countInAuditCard"
            placeholder="Count in audit card"
            tooltip={`If enabled, total of questions related to this ${t('question')} set will be displayed in ${t('audit')} card`}
            variant="secondaryVariant"
          />
          <Controller
            control={control}
            data-id="000460"
            name="icon"
            render={({ field }) => (
              <>
                <FormLabel alignItems="center" columnGap={1} data-id="000461" display={'flex'} fontSize="12px" fontWeight="regular" mb={1}>
                  Icon{' '}
                  <Text as="span" color="#e93c44" data-id="000462" fontSize="22px" fontWeight="bold" mt={'12px'}>
                    *
                  </Text>
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
                  variant="outline"
                >
                  {allIconNames.map((iconName) => (
                    <option data-id="000465" key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </Select>
                {field.value && ChakraIcons[field.value] && (
                  <Flex align="center" data-id="000466" gap={2} mt={1}>
                    <Text data-id="000467" fontSize="sm">
                      Preview:
                    </Text>
                    <Icon as={ChakraIcons[field.value] || ''} boxSize={4} data-id="000468" />
                  </Flex>
                )}
              </>
            )}
            rules={{ required: 'Icon is required' }}
          />
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
        breadcrumbs={['Admin', `${capitalize(t('question'))} sets`]}
        data-id="000473"
        mobileBreadcrumbs={[`${capitalize(t('question'))} sets`]}
        pageLabel={`${capitalize(t('question'))} set`}
      />
      <Box bg="auditsList.bg" data-id="000474" h="full" overflow="hidden">
        <Flex data-id="000475" h="full" px={['25px', 0]}>
          {renderContent()}
        </Flex>
      </Box>
    </>
  );
}

export default QuestionsCategories;
