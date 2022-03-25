import { useContext, useEffect, useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, useToast, Stack, Button, Select, Spacer } from "@chakra-ui/react";

import Loader from "../../components/Loader";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Header from "../../components/Header";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import useDevice from "../../hooks/useDevice";
import { IAuditType } from "../../interfaces/IAuditType";
import { Dropdown } from "../../components/Forms";
import { complianceItemFrequencies } from "../../hooks/useResponseUtils";
import { IAuditSection } from "../../interfaces/IAuditSection";
import { ChevronRight } from "../../icons";

const GET_AUDIT_TYPES = gql`
  query {
    auditTypes {
      _id
      name
      frequency
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

const defaultValues: Partial<IAuditType> = {
  _id: undefined,
  name: "",
  frequency: undefined,
  sections: [],
  view: "categorized",
};

const AuditTypes = () => {
  const toast = useToast();
  const frequencyOptions = useMemo(() => complianceItemFrequencies.map(f => ({ value: f, label: f })), []);
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_AUDIT_TYPES);
  const [createFunction] = useMutation(CREATE_AUDIT_TYPE);
  const [updateFunction] = useMutation(UPDATE_AUDIT_TYPE);
  const [deleteFunction] = useMutation(DELETE_AUDIT_TYPE);
  const device = useDevice();
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState(true);

  const getAuditTypes = (auditTypesArray: IAuditType[]) => {
    if (!auditTypesArray) {
      return [];
    }
    return auditTypesArray.map(auditType => ({
      ...auditType,
      sections: auditType.sections.map(({ type, _id }) => ({ type, _id })),
    })).sort((a, b) => a.name.localeCompare(b.name));
  }
  const [auditTypes, setAuditTypes] = useState<IAuditType[]>(getAuditTypes(data?.auditTypes));

  useEffect(() => {
    setAuditTypes(getAuditTypes(data?.auditTypes));
  }, [data]);

  const questionsCategories = data?.questionsCategories;

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner')
        return (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');
      else {
        return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());
      }
    };
    if (sortOrder) {
      setAuditTypes([...auditTypes].sort((a, b) => sort(a, b)));
    }
    else {
      setAuditTypes([...auditTypes].sort((a, b) => sort(b, a)));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    formState: { errors },
    watch,
    getValues,
    setValue,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });

  const sections = watch("sections") || [];

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openAuditTypeModal = (
    action: "edit" | "delete",
    auditType: IAuditType,
  ) => {
    setAdminModalState(action);
    reset({
      _id: auditType?._id,
      name: auditType.name,
      frequency: auditType.frequency,
      sections: auditType.sections,
    });
  };

  const handleAddAuditType = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const auditType = getValues();
        await createFunction({ variables: { auditType } });
        refetch();
        toast({ ...toastSuccess, description: "Audit type added" });
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
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
              frequency: auditType.frequency,
              sections: auditType.sections,
            },
          },
        });
        refetch();
        toast({ ...toastSuccess, description: "Audit type updated" });
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleDeleteAuditType = async () => {
    try {
      const _id = getValues('_id');
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: "Audit type deleted" });
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (["add", "edit"].includes(action) && !isFormValid) {
      return toast({
        ...toastFailed,
        description: "Please complete all the required fields",
      });
    }
    switch (action) {
      case "add":
        handleAddAuditType();
        break;
      case "edit":
        handleUpdateAuditType();
        break;
      case "delete":
        handleDeleteAuditType();
        break;
      default:
        setAdminModalState("closed");
    }
  };

  const renderAuditTypeRow = (auditType: IAuditType, i: number) => (
    <Flex
      key={auditType._id}
      w='full'
      h='73px'
      bg='#FFFFFF'
      mb="1px"
      p={4}
      alignItems='center'
      borderBottomRadius={(i === auditTypes.length - 1) ? 'lg' : ''}
      boxShadow="sm"
      flexShrink={0}
    >
      <Flex
        w='full'
        flexDir="column"
        pl={1}
        mr={4}
        cursor="pointer"
        onClick={() => openAuditTypeModal('edit', auditType)}
      >
        <Text
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{auditType.name}
        </Text>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"audit types"}
      >
        <Stack w={device === 'mobile' ? 'full' : "calc(100% - 150px)"} spacing={2}>
          <TextInput
            name="name"
            label="Name"
            placeholder='Name'
            control={control}
            validations={{
              notEmpty: true,
            }}
          />
          <Dropdown
            name="frequency"
            label="Frequency"
            placeholder='Frequency'
            control={control}
            options={frequencyOptions}
            validations={{
              notEmpty: true,
            }}
          />
          <Dropdown
            name="view"
            label="View"
            placeholder='View'
            control={control}
            options={[{ value: 'categorized', label: 'Categorized' }, { value: 'singlePage', label: 'Single page' }]}
            validations={{
              notEmpty: true,
            }}
          />
          <Stack>
            <Flex pt={4} align='center' justify="space-between" mb='none'>
              <Box
                color="dropdown.labelFont.normal"
                fontWeight="bold"
                fontSize="14px"
                position="static"
                left='none'
                zIndex={1}
              >
                Sections
              </Box>
            </Flex>
            <Stack spacing={4}>
              {sections.length > 0 ?
                sections.map((section, i) => (
                  <Stack key={`section-${i}`}>
                    <Text fontSize="smm">Section {i + 1}</Text>
                    <Text fontSize="sm">Type</Text>
                    <Select
                      css={{ paddingTop: "0" }}
                      borderRadius="8px"
                      borderWidth="1px"
                      top="5px"
                      fontSize="smm"
                      h="42px"
                      color="dropdown.font"
                      bg="dropdown.bg"
                      borderColor="dropdown.border.normal"
                      _active={{ bg: "dropdown.activeBg" }}
                      _focus={{ borderColor: "dropdown.border.focus.normal" }}
                      _placeholder={{ color: 'dropdown.placeholder' }}
                      icon={<ChevronRight stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
                      onChange={e => setValue("sections", sections.map((sectionValue, index) => {
                        if (index === i) {
                          return { type: e.target.value } as IAuditSection;
                        }
                        return sectionValue;
                      }))}
                      value={section.type}
                    >
                      <option value="notes">Notes</option>
                      <option value="questionsCategory">Question category</option>
                    </Select>
                    {section.type === 'questionsCategory' && (
                      <Stack pt={2}>
                        <Text fontSize="sm">Question category</Text>
                        <Select
                          css={{ paddingTop: "0" }}
                          borderRadius="8px"
                          borderWidth="1px"
                          top="5px"
                          fontSize="smm"
                          h="42px"
                          color="dropdown.font"
                          bg="dropdown.bg"
                          borderColor="dropdown.border.normal"
                          _active={{ bg: "dropdown.activeBg" }}
                          _focus={{ borderColor: "dropdown.border.focus.normal" }}
                          _placeholder={{ color: 'dropdown.placeholder' }}
                          icon={<ChevronRight stroke="dropdown.chevronDownIcon" transform="rotate(90deg)" />}
                          onChange={e => setValue("sections", sections.map((sectionValue, index) => {
                            if (index === i) {
                              return { ...sectionValue, _id: e.target.value };
                            }
                            return sectionValue;
                          }))}
                          value={section._id}
                        >
                          <option value={undefined}>Please select questions category</option>
                          {questionsCategories.map(({ _id, name }) => <option key={_id} value={_id}>{name}</option>)}
                        </Select>
                      </Stack>
                    )}
                  </Stack>
                ))
                : <Text fontSize="smm">No sections added</Text>}
            </Stack>
            <Spacer />
            <Spacer />
            <Button
              mt={16}
              bg="adminModal.button.bg"
              color="adminModal.button.color"
              fontSize="smm"
              fontWeight="bold"
              onClick={() => setValue("sections", [...sections, { type: "notes" }])}
            >Add section</Button>
          </Stack>
        </Stack>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Audit types"]} mobileBreadcrumbs={["Audit types"]} />
      <Flex h='calc(100vh - 160px)' px={["25px", 0]} overflow="auto">
        <Box w='full' h={['calc(100% - 90px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w='full' label="Name" onClick={() => { setSortType("name"); setSortOrder(!sortOrder); }} sortOrder={sortType === "name" && !sortOrder} showSortingIcon={sortType === "name"} />
          </AdminTableHeader>
          <Flex h="full" bg="white" flexDir="column" overflow="auto" w='full' borderBottomRadius="20px" fontSize="smm">
            {loading ? <Loader center={true} /> : (auditTypes?.length > 0 ? auditTypes?.map(renderAuditTypeRow) : (
              <Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
                No audit types found
              </Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default AuditTypes;
