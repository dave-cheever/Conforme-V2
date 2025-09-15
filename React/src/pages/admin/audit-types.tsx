import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Flex, HStack, Select, Spacer, Stack, Text, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import { Datepicker, Dropdown } from '../../components/Forms';
import TextInput from '../../components/Forms/TextInput';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { auditFrequencies } from '../../hooks/useAuditUtils';
import useDevice from '../../hooks/useDevice';
import { ChevronRight } from '../../icons';
import { IAuditType } from '../../interfaces/IAuditType';

const GET_AUDIT_TYPES = gql`
  query {
    auditTypes {
      _id
      name
      frequency
      startingDate
      view
      businessUnitScope
      recurring
      sections {
        type
        _id
      }
    }
    questionsCategories {
      _id
      name
    }
  }
`;
const CREATE_AUDIT_TYPE = gql`
  mutation ($auditType: AuditTypeCreateInput!) {
    createAuditType(auditType: $auditType) {
      _id
    }
  }
`;
const UPDATE_AUDIT_TYPE = gql`
  mutation ($auditTypeInput: AuditTypeModifyInput!) {
    updateAuditType(auditTypeInput: $auditTypeInput) {
      _id
    }
  }
`;
const DELETE_AUDIT_TYPE = gql`
  mutation ($_id: String!) {
    deleteAuditType(_id: $_id)
  }
`;

const defaultValues: Partial<Omit<IAuditType, 'recurring'> & { recurring: string }> = {
  _id: undefined,
  name: '',
  frequency: undefined,
  startingDate: new Date(),
  sections: [],
  view: 'categorized',
  recurring: 'yes',
  businessUnitScope: undefined,
};

function AuditTypes() {
  const toast = useToast();
  const { organizationConfig } = useAppContext();
  const frequencyOptions = useMemo(() => auditFrequencies.map((f) => ({ value: f, label: f })), []);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_AUDIT_TYPES);
  const [createFunction] = useMutation(CREATE_AUDIT_TYPE);
  const [updateFunction] = useMutation(UPDATE_AUDIT_TYPE);
  const [deleteFunction] = useMutation(DELETE_AUDIT_TYPE);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [disablePastDate, setDisablePastDate] = useState(false);

  const fetchSettings = () => {
    if (organizationConfig) {
      const safetyWalkModule = organizationConfig.modules.find((module) => module.type === 'audits');
      const disablePastDate = !!safetyWalkModule?.featureFlags?.disablePastDateSelection;
      setDisablePastDate(disablePastDate);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [organizationConfig]);

  const getAuditTypes = (auditTypesArray: IAuditType[]) => {
    if (!auditTypesArray) return [];

    return auditTypesArray
      .map((auditType) => ({
        ...auditType,
        sections: auditType.sections.map(({ type, _id }) => ({ type, _id })),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };
  const [auditTypes, setAuditTypes] = useState<IAuditType[]>(getAuditTypes(data?.auditTypes));

  useEffect(() => {
    setAuditTypes(getAuditTypes(data?.auditTypes));
  }, [data]);

  const questionsCategories = data?.questionsCategories;

  useEffect(() => {
    const sort = (a, b) => {
      let comparison = 0;
      if (sortType === 'owner') comparison = (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');
      else comparison = (a[sortType] || '').toString().localeCompare((b[sortType] || '').toString());

      return sortOrder === 'asc' ? comparison : -comparison;
    };

    setAuditTypes((prev) => [...prev].sort(sort));
  }, [sortType, sortOrder]);

  const {
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  const sections = watch('sections') || [];

  const selectedQuestionsCategoriesIds = useMemo(() => sections.filter((section) => section.type === 'questionsCategory').map((section) => section._id), [sections]);

  // Get available questions categories that haven't been selected yet
  const availableQuestionsCategories = useCallback(
    (currentSectionId?: string) => {
      if (!questionsCategories) return [];

      if (selectedQuestionsCategoriesIds.length === 0) return questionsCategories;

      // Filter out already selected categories, but include the current section's category
      const availableCategories = questionsCategories.filter(
        (category) => !selectedQuestionsCategoriesIds.includes(category._id) || category._id === currentSectionId,
      );

      return availableCategories.length > 0 ? availableCategories : questionsCategories;
    },
    [questionsCategories, selectedQuestionsCategoriesIds],
  );

  const disableAddNewSection = useMemo(() => selectedQuestionsCategoriesIds.length === questionsCategories?.length, [selectedQuestionsCategoriesIds, questionsCategories]);

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openAuditTypeModal = (action: 'edit' | 'delete', auditType: IAuditType) => {
    setAdminModalState(action);
    reset({
      _id: auditType?._id,
      name: auditType.name,
      frequency: auditType.frequency,
      startingDate: auditType.startingDate,
      sections: auditType.sections,
      view: auditType.view,
      recurring: auditType.recurring ? 'yes' : 'no',
      businessUnitScope: auditType.businessUnitScope,
    });
  };

  const handleAddAuditType = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const auditType = getValues();
        await createFunction({ variables: { auditType: { ...auditType, recurring: auditType.recurring === 'yes' } } });
        refetch();
        toast({ ...toastSuccess, description: 'Audit type added' });
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

  const handleUpdateAuditType = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const auditType = getValues();
        await updateFunction({
          variables: {
            auditTypeInput: {
              _id: auditType?._id,
              name: auditType.name,
              startingDate: auditType.startingDate,
              frequency: auditType.frequency,
              sections: auditType.sections,
              view: auditType.view,
              recurring: auditType.recurring === 'yes',
              businessUnitScope: auditType.businessUnitScope,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: 'Audit type updated' });
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

  const handleDeleteAuditType = async () => {
    try {
      const _id = getValues('_id');
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: 'Audit type deleted' });
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
        handleAddAuditType();
        break;
      case 'edit':
        handleUpdateAuditType();
        break;
      case 'delete':
        handleDeleteAuditType();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const handleAddAndResetAuditType = async () => {
    const isValid = await trigger();
    if (!isValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    try {
      const auditType = getValues();
      await createFunction({
        variables: { auditType: { ...auditType, recurring: auditType.recurring === 'yes' } },
      });
      toast({ ...toastSuccess, description: 'Audit type added' });
      reset({ ...defaultValues });
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const moveSection = (sectionIndex: number, newPosition: number) => {
    if (newPosition < 0 || newPosition >= sections.length) return;
    const sectionsCopy = [...sections];
    const [movedSection] = sectionsCopy.splice(sectionIndex, 1);
    sectionsCopy.splice(newPosition, 0, movedSection);
    setValue('sections', sectionsCopy);
  };
  const removeSection = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections.splice(sectionIndex, 1);
    setValue('sections', updatedSections);
  };

  const renderAuditTypeRow = (auditType: IAuditType, i: number) => {
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
        data-id="030925-ff153e"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={auditType._id}
        px={2}
        py={4}
        w="full"
      >
        <Flex
          cursor="pointer"
          data-id="030925-771319"
          flexDir="column"
          mr={4}
          onClick={() => openAuditTypeModal('edit', auditType)}
          pl={1}
          w="full"
        >
          <Text data-id="030925-8258e7" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {auditType.name}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        collection="audit types"
        data-id="030925-f22202"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetAuditType : undefined}
      >
        <Stack data-id="030925-e52760" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 80px)'}>
          <TextInput
            control={control}
            data-id="030925-affbbf"
            label="Audit type name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Dropdown
            control={control}
            data-id="030925-c28ae5"
            label="Frequency"
            name="frequency"
            options={frequencyOptions}
            placeholder="Frequency"
            required
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant"
          />
          <Datepicker
            control={control}
            data-id="030925-e3040b"
            disablePastDate={disablePastDate}
            label="Starting date"
            name="startingDate"
            placeholder="Starting date"
            required
            validations={{
              notEmpty: true,
            }}
          />

          <Dropdown
            control={control}
            data-id="030925-8c4914"
            label="View"
            name="view"
            options={[
              { value: 'categorized', label: 'Categorized' },
              { value: 'singlePage', label: 'Single page' },
            ]}
            required
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant"
          />
          <Dropdown
            control={control}
            data-id="030925-8ce422"
            label={`When should a ${t('business unit')} be assigned to an ${t('audit')} `}
            name="businessUnitScope"
            options={[
              { value: undefined, label: 'Never' },
              { value: 'audit', label: `When creating ${pluralize(t('audit'))}` },
              { value: 'answer', label: `When completing ${pluralize(t('question'))}` },
            ]}
            required
            variant="secondaryVariant"
          />
          <Dropdown
            control={control}
            data-id="030925-cef8ed"
            label={`Should ${pluralize(t('audit'))} be recurring by default?`}
            name="recurring"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            required
            validations={{
              notEmpty: true,
            }}
            variant="secondaryVariant"
          />
          <Stack data-id="030925-410cc5">
            <Flex align="center" data-id="030925-a23928" justify="space-between" mb="none" pt={4}>
              <Box
                color="dropdown.labelFont.normal"
                data-id="030925-a03b19"
                fontSize="14px"
                fontWeight="bold"
                left="none"
                position="static"
                zIndex={1}
              >
                Sections
              </Box>
            </Flex>
            <Stack data-id="030925-f2e111" spacing={4}>
              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <Stack data-id="030925-39748c" key={`section-${i}`}>
                    <HStack align="flex-end" data-id="030925-9eb700" fontSize="smm">
                      <Text data-id="030925-b1d57e">Section {i + 1}</Text>
                      {i > 0 && (
                        <Text
                          _hover={{ textDecoration: 'underline' }}
                          color="auditTypesAdmin.linkColor"
                          cursor="pointer"
                          data-id="030925-629fbc"
                          fontSize="xs"
                          onClick={() => moveSection(i, i - 1)}
                        >
                          Move Up
                        </Text>
                      )}
                      {i < sections.length - 1 && (
                        <Text
                          _hover={{
                            textDecoration: 'underline',
                          }}
                          color="auditTypesAdmin.linkColor"
                          cursor="pointer"
                          data-id="030925-480ece"
                          fontSize="xs"
                          onClick={() => moveSection(i, i + 1)}
                        >
                          Move Down
                        </Text>
                      )}

                      <Text
                        _hover={{
                          textDecoration: 'underline',
                        }}
                        color="auditTypesAdmin.linkColor"
                        cursor="pointer"
                        data-id="030925-9b8dad"
                        fontSize="xs"
                        onClick={() => removeSection(i)}
                      >
                        Remove
                      </Text>
                    </HStack>
                    {section.type === 'questionsCategory' && (
                      <Select
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
                        data-id="030925-758b69"
                        fontSize="smm"
                        h="42px"
                        icon={<ChevronRight data-id="030925-65eb6a" stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
                        onChange={(e) =>
                          setValue(
                            'sections',
                            sections.map((sectionValue, index) => {
                              if (index === i) {
                                return {
                                  ...sectionValue,
                                  _id: e.target.value,
                                };
                              }
                              return sectionValue;
                            }),
                          )
                        }
                        top="5px"
                        value={section._id}
                      >
                        <option data-id="030925-f18f49" value={undefined}>
                          Please select questions category
                        </option>
                        {availableQuestionsCategories(section._id)?.map(({ _id, name }) => (
                          <option data-id="030925-c39380" key={_id} value={_id}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Stack>
                ))
              ) : (
                <Text data-id="030925-29e254" fontSize="smm">
                  No sections added
                </Text>
              )}
            </Stack>
            <Spacer data-id="030925-cfcad2" />
            <Spacer data-id="030925-531f59" />
            <Button
              bg="adminModal.button.bg"
              color="adminModal.button.color"
              data-id="030925-e18853"
              fontSize="smm"
              fontWeight="bold"
              isDisabled={disableAddNewSection}
              mt={16}
              onClick={() => {
                setValue('sections', [...sections, { type: 'questionsCategory' }]);
              }}
            >
              Add section
            </Button>
          </Stack>
        </Stack>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Audit types']} data-id="030925-6f5ee9" mobileBreadcrumbs={['Audit types']} pageLabel="Audit type" />
      <Flex
        bg="auditsList.bg"
        borderRadius="10px"
        data-id="030925-708948"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={[0, '0 25px 30px 30px']}
      >
        <Flex data-id="030925-9efdfe" h="full" px={['25px', 0]} w="full">
          <Box
            border="1px solid"
            borderColor="auditsList.headerBorderColor"
            data-id="030925-e2118e"
            h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            w={['full', 'full', 'calc(100%)']}
          >
            <AdminTableHeader data-id="030925-ae4ff0">
              <AdminTableHeaderElement
                data-id="030925-e42f7c"
                label="Name"
                onClick={() => {
                  setSortType('name');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'name'}
                sortOrder={sortType === 'name' ? sortOrder : undefined}
                w="full"
              />
            </AdminTableHeader>
            <Box bg="auditsList.bg" borderBottomRadius="10px" data-id="030925-6355bb" h="full" overflow="auto" w="full">
              {loading ? (
                <Loader center data-id="030925-ce726f" />
              ) : auditTypes?.length > 0 ? (
                auditTypes?.map(renderAuditTypeRow)
              ) : (
                <Flex data-id="030925-b57600" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                  No audit types found
                </Flex>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export default AuditTypes;

export const auditTypesAdminStyles = {
  auditTypesAdmin: {
    linkColor: '#005699',
  },
};
