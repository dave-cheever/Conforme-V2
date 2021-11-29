import { useContext, useEffect, useState } from "react";
import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import AdminTableRow from "../../components/Admin/AdminTableRow";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import TextInput from "../../components/Forms/TextInput";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import { IBaseWithName } from "../../interfaces/IBaseWithName";
import { AdminContext } from "../../contexts/AdminProvider";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminModal from "../../components/Admin/AdminModal";
import BarChart from "../../components/BarChart";

const GET_FUNCTIONAL_AREAS = gql`
  query {
    functionalAreas {
      _id
      name
      count
    }
  }
`;
const CREATE_FUNCTIONAL_AREA = gql`
  mutation ($name: String!) {
    createFunctionalArea(name: $name) {
      _id
      name
    }
  }
`;
const UPDATE_FUNCTIONAL_AREA = gql`
  mutation ($values: BaseWithNameModifyInput!) {
    updateFunctionalArea(functionalAreaInput: $values) {
      _id
      name
    }
  }
`;
const DELETE_FUNCTIONAL_AREA = gql`
  mutation ($_id: String!) {
    deleteFunctionalArea(_id: $_id)
  }
`;

const defaultValues = {
  _id: "",
  name: "",
};

const FunctionalAreas = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_FUNCTIONAL_AREAS);
  const [createFunction] = useMutation(CREATE_FUNCTIONAL_AREA);
  const [updateFunction] = useMutation(UPDATE_FUNCTIONAL_AREA);
  const [deleteFunction] = useMutation(DELETE_FUNCTIONAL_AREA);
  const [areas, setAreas] = useState<IBaseWithName[]>([]);

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
    if (data?.functionalAreas) {
      setAreas(
        [...data.functionalAreas].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setAreas([]);
    }
  }, [data]);

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openFunctionalAreaModal = (
    action: "edit" | "delete",
    functionalArea: IBaseWithName
  ) => {
    setAdminModalState(action);
    reset({
      _id: functionalArea._id,
      name: functionalArea.name,
    });
  };

  const handleAddFunctionalArea = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: values });
        toast({ ...toastSuccess, description: "Functional area added" });
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

  const handleUpdateFunctionalArea = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: "Functional area updated" });
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

  const handleDeleteFunctionalArea = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: "Functional area deleted" });
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
        handleAddFunctionalArea();
        break;
      case "edit":
        handleUpdateFunctionalArea();
        break;
      case "delete":
        handleDeleteFunctionalArea();
        break;
      default:
        setAdminModalState("closed");
    }
  };

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"functional area"}
      >
        <Flex w="full" align="flex-start" direction="column">
          <TextInput
            name="name"
            label="Name"
            placeholder="Functional area name"
            control={control}
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header
        breadcrumbs={["Admin", "Functional areas"]}
        hideBreadcrumbsOnMobile
      />
      <Box p={["0", "0 25px 30px 30px"]} h="calc(100vh - 160px)">
        <Flex h="full" flexDirection={["column-reverse", "row"]}>
          <Box w={["100%", "calc(100% - 250px)"]} h='calc(100% - 35px)' mr="50px">
            <AdminTableHeader>
              <AdminTableHeaderElement w="50%" label="Functional area" />
              <AdminTableHeaderElement w="50%" label="Responses count" />
            </AdminTableHeader>
            {loading ? (
              <Box mt={20}>
                <Loader />
              </Box>
            ) : (
              <Stack
                h="full"
                bg="white"
                mt={["20px", "0"]}
                borderBottomRadius={["0", "10px"]}
                overflow="auto"
                spacing={["0", "1px"]}
              >
                {areas?.length > 0 ? (
                  areas?.map((functionalArea, i) => (
                    <AdminTableRow
                      key={functionalArea._id}
                      element={functionalArea}
                      index={i}
                      edit={() => openFunctionalAreaModal("edit", functionalArea)}
                    />
                  ))
                ) : (
                  <Flex w="full" h="full" fontSize="18px" fontStyle="italic">
                    No Functional Area found
                  </Flex>
                )}
              </Stack>
            )}
          </Box>
          <Flex
            flexDirection="column"
            alignItems="center"
            w={["100%", "220px"]}
          >
            <Box w="100%">
              {areas && <BarChart data={areas} label="Functional areas" />}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default FunctionalAreas;

export const functionalAreasStyles = {
  functionalAreas: {
  fontColor: "#818197",
}}