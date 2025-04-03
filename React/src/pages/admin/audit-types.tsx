import { useContext, useEffect, useMemo, useState } from 'react';
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
  const frequencyOptions = useMemo(() => auditFrequencies.map((f) => ({ value: f, label: f })), []);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_AUDIT_TYPES);
  const [createFunction] = useMutation(CREATE_AUDIT_TYPE);
  const [updateFunction] = useMutation(UPDATE_AUDIT_TYPE);
  const [deleteFunction] = useMutation(DELETE_AUDIT_TYPE);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
    setAuditTypes([...auditTypes].sort(sort));
  }, [sortType, sortOrder, auditTypes]);

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

  const renderAuditTypeRow = (auditType: IAuditType, i: number) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === auditTypes.length - 1 ? 'lg' : ''}
      boxShadow="sm"
      data-id="3fc151e99afd"
      flexShrink={0}
      h="73px"
      key={auditType._id}
      mb="1px"
      p={4}
      w="full"
    >
      <Flex
        cursor="pointer"
        data-id="b8b600ae568d"
        flexDir="column"
        mr={4}
        onClick={() => openAuditTypeModal('edit', auditType)}
        pl={1}
        w="full"
      >
        <Text data-id="a09e2d687387" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {auditType.name}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        collection="audit types"
        data-id="4392ddcb8d3b"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
      >
        <Stack data-id="58b2d418f910" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            control={control}
            data-id="4a3fec84e4e7"
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
            data-id="d631ddb7cefd"
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
            data-id="ecd810896977"
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
            data-id="7488a717820b"
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
            data-id="43949da485b2"
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
            data-id="cf1cde052c90"
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
          <Stack data-id="6115386dc6ee">
            <Flex align="center" data-id="1bcec17820a4" justify="space-between" mb="none" pt={4}>
              <Box
                color="dropdown.labelFont.normal"
                data-id="4c3555577239"
                fontSize="14px"
                fontWeight="bold"
                left="none"
                position="static"
                zIndex={1}
              >
                Sections
              </Box>
            </Flex>
            <Stack data-id="492f3d1d1b5d" spacing={4}>
              {sections.length > 0 ? (
                sections.map((section, i) => (
                  <Stack data-id="b86ee4594a22" key={`section-${i}`}>
                    <HStack align="flex-end" data-id="8426669afae6" fontSize="smm">
                      <Text data-id="e070e26b85be">Section {i + 1}</Text>
                      {i > 0 && (
                        <Text
                          _hover={{ textDecoration: 'underline' }}
                          color="auditTypesAdmin.linkColor"
                          cursor="pointer"
                          data-id="2895333bb2a9"
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
                          data-id="3d689bfea0d4"
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
                        data-id="00434285886e"
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
                        data-id="5e82ddb87871"
                        fontSize="smm"
                        h="42px"
                        icon={<ChevronRight data-id="5488fb98d036" stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
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
                        <option data-id="efa335fc50f4" value={undefined}>
                          Please select questions category
                        </option>
                        {questionsCategories?.map(({ _id, name }) => (
                          <option data-id="2ec3671292d5" key={_id} value={_id}>
                            {name}
                          </option>
                        ))}
                      </Select>
                    )}
                  </Stack>
                ))
              ) : (
                <Text data-id="d5397551349b" fontSize="smm">
                  No sections added
                </Text>
              )}
            </Stack>
            <Spacer data-id="42fcc2619e1f" />
            <Spacer data-id="fde47af89b6c" />
            <Button
              bg="adminModal.button.bg"
              color="adminModal.button.color"
              data-id="be44fea35efa"
              fontSize="smm"
              fontWeight="bold"
              mt={16}
              onClick={() => setValue('sections', [...sections, { type: 'questionsCategory' }])}
            >
              Add section
            </Button>
          </Stack>
        </Stack>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Audit types']} data-id="a14d6d59aac0" mobileBreadcrumbs={['Audit types']} />
      <Flex data-id="790af0b7b837" h="calc(100vh - 160px)" overflow="auto" px={['25px', 0]}>
        <Box data-id="105632f83f3c" h={['calc(100% - 160px)', 'calc(100% - 35px)']} p={[0, '0 25px 30px 30px']} w="full">
          <AdminTableHeader data-id="e77d6573756f">
            <AdminTableHeaderElement
              data-id="51d440e398eb"
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
          <Flex
            bg="white"
            borderBottomRadius="20px"
            data-id="68a29221d31a"
            flexDir="column"
            fontSize="smm"
            h="full"
            overflow="auto"
            w="full"
          >
            {loading ? (
              <Loader center data-id="6bd31351d6c0" />
            ) : auditTypes?.length > 0 ? (
              auditTypes?.map(renderAuditTypeRow)
            ) : (
              <Flex data-id="ae21bcd5b3b0" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                No audit types found
              </Flex>
            )}
          </Flex>
        </Box>
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
