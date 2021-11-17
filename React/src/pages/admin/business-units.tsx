import { useContext, useEffect, useState, useCallback } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Box, Flex, Image, Text, Tooltip, useToast } from "@chakra-ui/react";

import Loader from "../../components/Loader";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/AdminModal";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Header from "../../components/Header";
import { Bin, Eye } from "../../icons";
import { IBusinessUnit } from "../../interfaces/IBusinessUnit";

const GET_BUSINESS_UNITS = gql`
  query {
    businessUnits {
      _id
      name
      type
      region
      ownerId
      # owner {
      #   firstName
      #   lastName
      # }
      imgUrl
    }
  }
`;
const CREATE_BUSINESS_UNIT = gql`
  mutation ($values: BusinessUnitInput!) {
    createBusinessUnit(businessUnitInput: $values) {
      _id
    }
  }
`;
const UPDATE_BUSINESS_UNIT = gql`
  mutation ($values: BusinessUnitModifyInput!) {
    updateBusinessUnit(businessUnitModifyInput: $values) {
      _id
    }
  }
`;
const DELETE_BUSINESS_UNIT = gql`
  mutation ($_id: String!) {
    deleteBusinessUnit(_id: $_id)
  }
`;

const defaultValues: Partial<IBusinessUnit> = {
  _id: undefined,
  name: "",
  type: "",
  region: "",
  ownerId: "uuid"
};

const BusinessUnits = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_BUSINESS_UNITS);
  const [createFunction] = useMutation(CREATE_BUSINESS_UNIT);
  const [updateFunction] = useMutation(UPDATE_BUSINESS_UNIT);
  const [deleteFunction] = useMutation(DELETE_BUSINESS_UNIT);
  const [businessUnits, setBusinessUnits] = useState<IBusinessUnit[]>([]);

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });

  useEffect(() => {
    if (data?.businessUnits) {
      setBusinessUnits(
        [...data.businessUnits].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setBusinessUnits([]);
    }
  }, [data]);

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openBusinessUnitModal = (
    action: "edit" | "delete",
    businessUnit: IBusinessUnit
  ) => {
    setAdminModalState(action);
    reset({
      _id: businessUnit._id,
      name: businessUnit.name,
      type: businessUnit.type,
      region: businessUnit.region,
      ownerId: businessUnit.ownerId,
    });
  };

  const handleAddBusinessUnit = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: { values } });
        toast({ ...toastSuccess, description: "Business Unit added" });
        refetch();
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

  const handleUpdateBusinessUnit = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: "Business Unit updated" });
        refetch();
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

  const handleDeleteBusinessUnit = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: "Business Unit deleted" });
      refetch();
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
        handleAddBusinessUnit();
        break;
      case "edit":
        handleUpdateBusinessUnit();
        break;
      case "delete":
        handleDeleteBusinessUnit();
        break;
      default:
        setAdminModalState("closed");
    }
  };

  const renderBusinessUnitRow = useCallback((businessUnit: IBusinessUnit, i: number) => (
    <Flex
      key={businessUnit._id}
      w='full'
      h='73px'
      bg='#FFFFFF'
      mb="1px"
      p={4}
      alignItems='center'
      borderTopRadius={i === 0 ? 'lg' : ''}
      borderBottomRadius={(i === businessUnits.length - 1) ? 'lg' : ''}
      boxShadow="sm"
    >
      <Flex w='30%' pl={1} mr={4} align='center' cursor="pointer"
        onClick={() => openBusinessUnitModal('edit', businessUnit)}
      >
        <Flex w='36px' h='36px' mr={4} rounded='md' bg="#F2F2F2" shrink={0}>
          <Image fit='cover' rounded="md" src={businessUnit.imgUrl} />
        </Flex>
        <Text
          fontWeight='bold'
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{businessUnit.name}</Text>
      </Flex>
      <Box w='10%'>{businessUnit?.type}</Box>
      <Box w='20%'>{businessUnit?.region}</Box>
      <Box w='20%'>{businessUnit?.owner?.firstName && businessUnit?.owner?.lastName && `${businessUnit.owner.firstName} ${businessUnit.owner.lastName}`}</Box>
      <Flex w='10%' align='center'>
        <Text>{businessUnit.responsesCount || 0}</Text>
        <Tooltip label="Show Items" fontSize="md">
          <Eye color='#018587' cursor='pointer' ml={4} mt='2px'
          // onClick={() => onEyeClick(businessUnit.id)} 
          />
        </Tooltip>
      </Flex>
      <Box textAlign='right' w='10%' pr={6}>
        <Bin w='20px' cursor='pointer' _hover={{ color: 'businessUnit.binIconColor' }} color='#424B50'
          onClick={() => openBusinessUnitModal('delete', businessUnit)}
        />
      </Box>
    </Flex>
  ), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"businessUnit"}
      >
        <Flex w="full" align="flex-start" direction="column">
          <TextInput
            name="name"
            control={control}
            label="Name"
            placeholder="Business Unit Name"
            validations={{
              notEmpty: true,
            }}
          />
          <TextInput
            name="type"
            control={control}
            label="Unit Type"
            placeholder="Unit Type"
            validations={{
              notEmpty: true,
            }}
          />
          <TextInput
            name="region"
            control={control}
            label="Region"
            placeholder="Region Name"
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Business units"]} />
      <Flex h='calc(100vh - 150px)'>
        <Box w='full' h='full' overflow='auto' p={[0, 8]}>
          <Flex pb={4} w='full' color="#9A9EA1" display={['none', "flex"]}>
            <Box w='30%'>Business unit name</Box>
            <Box w='10%'>Unit type</Box>
            <Box w='20%'>Region name</Box>
            <Box w='18%'>Owner</Box>
            <Box w='12%'>Responses count</Box>
            <Box textAlign='right' w='9%'>Actions</Box>
          </Flex>
          <Box w='full'>
            {loading && <Loader />}
            {!loading && businessUnits?.length > 0 ? businessUnits?.map(renderBusinessUnitRow) : (
              <Flex w='full' h='full' fontSize='18px' fontStyle='italic'>No business units found.</Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default BusinessUnits;
