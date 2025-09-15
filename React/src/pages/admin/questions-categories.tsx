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
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        data-id="030925-1b2164"
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
          cursor="pointer"
          data-id="030925-7b4bbc"
          flexDir="column"
          mr={4}
          onClick={() => openQuestionsCategoryModal('edit', questionsCategory)}
          pl={1}
          w="full"
        >
          <Text data-id="030925-061347" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {questionsCategory.name}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        collection="questions categories"
        data-id="030925-2d80f5"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetQuestionsCategory : undefined}
      >
        <Stack data-id="030925-a8ae4e" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            control={control}
            data-id="030925-981e65"
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
            data-id="030925-7a0ba5"
            label="Allow answers"
            name="withAnswers"
            placeholder="Allow answers"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="030925-8237e4"
            label="Allow custom questions"
            name="allowCustomQuestions"
            placeholder="Allow custom questions"
            variant="secondaryVariant"
          />
          <NumberInput
            control={control}
            data-id="030925-58dc2f"
            label="Max number of questions"
            name="maxQuestionsNumber"
            placeholder="Max number of questions"
            required
            tooltip="0 means no limit"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="030925-081333"
            label="Editable after submission"
            name="notBlockedAfterCompletion"
            placeholder="Editable after submission"
            tooltip="If enabled, questions and answers in this category will be editable after submission"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="030925-59036d"
            label="Use status"
            name="useStatus"
            placeholder="Use status"
            tooltip="If disabled, status will not show for associated answers"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="030925-a54930"
            label="Show in insights"
            name="showInInsights"
            placeholder="Show in insights"
            tooltip="If enabled, answers related to this questions category will be shown in insights"
            variant="secondaryVariant"
          />
          <Toggle
            control={control}
            data-id="030925-a7050f"
            label="Count in audit card"
            name="countInAuditCard"
            placeholder="Count in audit card"
            tooltip={`If enabled, total of questions related to this question category will be displayed in ${t('audit')} card`}
            variant="secondaryVariant"
          />
          <Controller
            control={control}
            data-id="030925-3ccf0c"
            name="icon"
            render={({ field }) => (
              <>
                <FormLabel
                  alignItems="center"
                  columnGap={1}
                  data-id="030925-4a34a7"
                  display={'flex'}
                  fontSize="12px"
                  fontWeight="regular"
                  mb={1}
                  >
                    Icon <Text
                  as="span"
                  color="#e93c44"
                  data-id="030925-fb38d9"
                  fontSize="22px"
                  fontWeight="bold"
                  mt={"12px"}>*</Text>
                  </FormLabel>

                <Select
                  data-id="030925-60dd0b"
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
                  icon={<ChevronRight data-id="030925-f91714" stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
                  mb={2}
                  placeholder="Select an icon"
                  variant="outline">
                  {allIconNames.map((iconName) => (
                    <option data-id="030925-b47138" key={iconName} value={iconName}>
                      {iconName}
                    </option>
                  ))}
                </Select>
                {field.value && ChakraIcons[field.value] && (
                  <Flex align="center" data-id="030925-154564" gap={2} mt={1}>
                    <Text data-id="030925-4b6dcc" fontSize="sm">Preview:</Text>
                    <Icon as={ChakraIcons[field.value] || ''} boxSize={4} data-id="030925-d708cd" />
                  </Flex>
                )}
              </>
            )}
            rules={{ required: 'Icon is required' }} />
          <Stack data-id="030925-2bcf2c" pt={2}>
            <Text data-id="030925-1c00b3" fontSize="11px" fontWeight="bold">
              Options
            </Text>
            <CheckboxGroup
              data-id="030925-78e46c"
              defaultValue={questionsCategory.options?.map((option) => option.setting)}
              onChange={onChangeOption}
            >
              {availableOptions(!!module?.featureFlags?.enableSafetyWalk).map((option) => (
                <Checkbox data-id="030925-7a8eed" key={option.setting} label={option.name} value={option.setting} />
              ))}
            </CheckboxGroup>
          </Stack>
        </Stack>
      </AdminModal>
      <Header
        breadcrumbs={['Admin', 'Questions categories']}
        data-id="030925-75447b"
        mobileBreadcrumbs={['Questions categories']}
        pageLabel={`${capitalize(t('question'))} set`}
      />
      <Flex
        bg="auditsList.bg"
        borderRadius="10px"
        data-id="030925-a31380"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={[0, '0 25px 30px 30px']}
      >
         <Flex data-id="030925-519fa9" h="full" px={['25px', 0]} w="full">
          <Box
          border="1px solid"
          borderColor="auditsList.headerBorderColor"
          data-id="030925-5a3b20"
          h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            overflow="hidden"
            w={['full', 'full', 'calc(100%)']}
        >
          <AdminTableHeader data-id="030925-515a04">
            <AdminTableHeaderElement
              data-id="030925-e65d2c"
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
          <Box bg="auditsList.bg" borderBottomRadius="10px" data-id="030925-9f66b2" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader center data-id="030925-4202f3" />
            ) : questionsCategories?.length > 0 ? (
              questionsCategories?.map(renderQuestionsCategoryRow)
            ) : (
              <Flex data-id="030925-b03e94" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
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
