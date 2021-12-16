import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, Tooltip, useToast, Stack } from "@chakra-ui/react";
import Dropdown from "../../components/Forms/Dropdown";
import Loader from "../../components/Loader";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Header from "../../components/Header";
import { ArrowCount } from "../../icons";
import { IBusinessUnit } from "../../interfaces/IBusinessUnit";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import useDevice from "../../hooks/useDevice";

const GET_BUSINESS_UNITS = gql`
  query {
    businessUnits {
      _id
      name
      type
      region
      ownerId
      owner {
        displayName
      }
      imgUrl
      complianceItemsResponsesCount
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
  const device = useDevice();

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
      _id: businessUnit?._id,
      name: businessUnit?.name,
      type: businessUnit?.type,
      region: businessUnit?.region,
      ownerId: businessUnit?.ownerId,
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

  const renderBusinessUnitRow = (businessUnit: IBusinessUnit, i: number) => (
    <Flex
      key={businessUnit._id}
      w='full'
      h='73px'
      bg='#FFFFFF'
      mb="1px"
      p={4}
      alignItems='center'
      borderBottomRadius={(i === businessUnits.length - 1) ? 'lg' : ''}
      boxShadow="sm"
      flexShrink={0}
    >
      <Flex 
        w={["80%", '30%']} 
        flexDir="column"
        pl={1} 
        mr={4} 
        cursor="pointer"
        onClick={() => openBusinessUnitModal('edit', businessUnit)}
      >
        <Text
          overflow='hidden'
          textOverflow='ellipsis'
          whiteSpace='nowrap'
        >{businessUnit.name}</Text>
        {device === "mobile" && <Text mt="3px" fontSize="11px" color="#818197">{businessUnit?.type}</Text>}
      </Flex>
      {device !== "mobile" && 
        <>
          <Box w='calc(70% / 4)'>{businessUnit?.type}</Box>
          <Box w='calc(70% / 4)'>{businessUnit?.region}</Box>
          <Box w='calc(70% / 4)'>{businessUnit?.owner?.displayName}</Box>
        </>
      }
      <Flex w={["20%", 'calc(70% / 4)']} align='center'>
        <Text>{businessUnit.complianceItemsResponsesCount || 0}</Text>
        <Tooltip label="Show Items" fontSize="md">
          <ArrowCount w="10px" h="10px" stroke="#282F36" cursor="pointer" ml="13px" />
        </Tooltip>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"business unit"}
      >
        <Flex w="full" align="flex-start" direction="column">
          <Text fontWeight="bold" fontSize="smm" pb={2}>Item attributes</Text>
          <Stack w="full" spacing={2}>
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
              control={control}
              name="type"
              label="Unit Type"
              placeholder="Select Unit Type"
              validations={{
                notEmpty: true,
              }}
              options={[{ label: "Unit Type 1", value: "unit type 1" }]}
            />
            <Dropdown
              control={control}
              name="region"
              label="Region"
              placeholder="Select Region"
              validations={{
                notEmpty: true,
              }}
              options={[{ label: "Head Office", value: "Head Office" }]}
            />
          </Stack>
        </Flex>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Business units"]} mobileBreadcrumbs={["Business units"]}/>
      <Flex h='calc(100vh - 160px)' px={["25px", 0]}>
        <Box w='full' h={['calc(100% - 170px)', 'calc(100% - 35px)']} p={[0, "0 25px 30px 30px"]}>
          <AdminTableHeader>
            <AdminTableHeaderElement w={["80%", "30%"]} label="Unit name" />
            {device !== "mobile" && 
              <>
                <AdminTableHeaderElement w="calc(70% / 4)" label="Unit type" />
                <AdminTableHeaderElement w="calc(70% / 4)" label="Region name" />
                <AdminTableHeaderElement w="calc(70% / 4)" label="Owner" />
              </>
            }
            <AdminTableHeaderElement w={["20%", "calc(70% / 4)"]} label="# of responses" />
          </AdminTableHeader>
          <Flex h="full" bg="white" flexDir="column" overflow="auto" w='full' borderBottomRadius="10px" fontSize="smm">
            {loading ? <Loader center={true}/>: (businessUnits?.length > 0 ? businessUnits?.map(renderBusinessUnitRow) : (
              <Flex w='full' h='full' fontSize='18px' fontStyle='italic' align='center' justify="center">No business units found.</Flex>
            ))}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default BusinessUnits;

export const businessUnitsStyles = {
  businessUnit: {
    binIconColor: "#FC5960",
    fontColor: "#818197",
  }
}
