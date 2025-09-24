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
        data-id="000355"
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
        key={auditType._id}
        px={2}
        py={4}
        w="full"
      >
        <Flex
          data-id="000356"
          cursor="pointer"
          flexDir="column"
          mr={4}
          onClick={() => openAuditTypeModal('edit', auditType)}
          pl={1}
          w="full"
        >
          <Text data-id="000357" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {auditType.name}
          </Text>
        </Flex>
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        data-id="000358"
        collection="audit types"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetAuditType : undefined}
      >
        <Stack data-id="000359" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 80px)'}>
          <TextInput
            data-id="000360"
            control={control}
            label="Audit type name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
            }}
          />
          <Dropdown
            data-id="000361"
            control={control}
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
            data-id="000362"
            control={control}
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
            data-id="000363"
            control={control}
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
            data-id="000364"
            control={control}
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
            data-id="000365"
            control={control}
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
          <Stack data-id="000366">
            <Flex data-id="000367" align="center" justify="space-between" mb="none" pt={4}>
              <Box
                data-id="000368"
                color="dropdown.labelFont.normal"
                fontSize="14px"
                fontWeight="bold"
                left="none"
                position="static"
                zIndex={1}
              >
                Sections
              </Box>
            </Flex>
            <Stack data-id="000369" spacing={4}>
              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <Stack data-id="000370" key={`section-${i}`}>
                    <HStack data-id="000371" align="flex-end" fontSize="smm">
                      <Text data-id="000372">Section {i + 1}</Text>
                      {i > 0 && (
                        <Text
                          data-id="000373"
                          _hover={{ textDecoration: 'underline' }}
                          color="auditTypesAdmin.linkColor"
                          cursor="pointer"
                          fontSize="xs"
                          onClick={() => moveSection(i, i - 1)}
                        >
                          Move Up
                        </Text>
                      )}
                      {i < sections.length - 1 && (
                        <Text
                          data-id="000374"
                          _hover={{
                            textDecoration: 'underline',
                          }}
                          color="auditTypesAdmin.linkColor"
                          cursor="pointer"
                          fontSize="xs"
                          onClick={() => moveSection(i, i + 1)}
                        >
                          Move Down
                        </Text>
                      )}

                      <Text
                        data-id="000375"
                        _hover={{
                          textDecoration: 'underline',
                        }}
                        color="auditTypesAdmin.linkColor"
                        cursor="pointer"
                        fontSize="xs"
                        onClick={() => removeSection(i)}
                      >
                        Remove
                      </Text>
                    </HStack>
                    {section.type === 'questionsCategory' && (
                      <Select
                        data-id="000376"
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
                        icon={<ChevronRight data-id="000377" stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
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
                        <option data-id="000378" value={undefined}>
                          Please select questions category
                        </option>
                        {availableQuestionsCategories(section._id)?.map(({ _id, name }) => (
                          <option data-id="000379" key={_id} value={_id}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Stack>
                ))
              ) : (
                <Text data-id="000380" fontSize="smm">
                  No sections added
                </Text>
              )}
            </Stack>
            <Spacer data-id="000381" />
            <Spacer data-id="000382" />
            <Button
              data-id="000383"
              bg="adminModal.button.bg"
              color="adminModal.button.color"
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
      <Header data-id="000384" breadcrumbs={['Admin', 'Audit types']} mobileBreadcrumbs={['Audit types']} pageLabel="Audit type" />
      <Flex
        data-id="000385"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        overflow="auto"
        p={[0, '0 25px 30px 30px']}
      >
        <Flex data-id="000386" h="full" px={['25px', 0]} w="full">
          <Box
            data-id="000387"
            border="1px solid"
            borderColor="auditsList.headerBorderColor"
            h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            w={['full', 'full', 'calc(100%)']}
          >
            <AdminTableHeader data-id="000388">
              <AdminTableHeaderElement
                data-id="000389"
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
            <Box data-id="000390" bg="auditsList.bg" borderBottomRadius="10px" h="full" overflow="auto" w="full">
              {loading ? (
                <Loader data-id="000391" center />
              ) : auditTypes?.length > 0 ? (
                auditTypes?.map(renderAuditTypeRow)
              ) : (
                <Flex data-id="000392" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
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
