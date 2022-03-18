import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';

import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import AdminTableRow from "../../components/Admin/AdminTableRow";
import Header from "../../components/Header";
import { IBaseWithName } from "../../interfaces/IBaseWithName";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Loader from "../../components/Loader";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import BarChart from "../../components/BarChart";
import useDevice from "../../hooks/useDevice";

const GET_REGULATORY_BODIES = gql`
  query {
    regulatoryBodies {
      _id
      name
      complianceItemsResponsesCount
    }
  }
`;
const CREATE_REGULATORY_BODY = gql`
  mutation ($name: String!){
    createRegulatoryBody(name: $name) {
      _id
      name
    }
  }
`;
const UPDATE_REGULATORY_BODY = gql`
  mutation ($values: BaseWithNameModifyInput!){
    updateRegulatoryBody(regulatoryBodyInput: $values) {
      _id
      name
    }
  }
`;
const DELETE_REGULATORY_BODY = gql`
  mutation ($_id: String!){
    deleteRegulatoryBody(_id: $_id)
  }
`;

const defaultValues = {
  _id: '',
  name: '',
};

const RegulatoryBodies = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_REGULATORY_BODIES);
  const [createFunction] = useMutation(CREATE_REGULATORY_BODY);
  const [updateFunction] = useMutation(UPDATE_REGULATORY_BODY);
  const [deleteFunction] = useMutation(DELETE_REGULATORY_BODY);
  const device = useDevice();
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState(true);
  const [currentRegulatoryBodyName, setCurrentRegulatoryBodyName] = useState<string>("");


  const getRegulatoryBodies = (regulatoryBodiesArray: IBaseWithName[]) => {
    if (!regulatoryBodiesArray) {
      return [];
    }
    return [...regulatoryBodiesArray].sort((a, b) => a.name.localeCompare(b.name));
  }
  const [regulatoryBodies, setRegulatoryBodies] = useState<IBaseWithName[]>(getRegulatoryBodies(data?.regulatoryBodies));

  useEffect(() => {
    setRegulatoryBodies(getRegulatoryBodies(data?.regulatoryBodies));
  }, [data]);

  useEffect(() => {
    if (sortOrder) {
      setRegulatoryBodies([...regulatoryBodies].sort((a, b) => {
        return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString())
      }));
    }
    else {
      setRegulatoryBodies([...regulatoryBodies].sort((a, b) => {
        return (b[sortType] || 0).toString().localeCompare((a[sortType] || 0).toString())
      }));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const { control, formState: { errors }, getValues, trigger, reset } = useForm({
    mode: 'all',
    defaultValues,
  });

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') {
      reset(defaultValues);
      setCurrentRegulatoryBodyName("");
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openRegulatoryBodyModal = (action: 'edit' | 'delete', regulatoryBody: IBaseWithName) => {
    setAdminModalState(action);
    setCurrentRegulatoryBodyName(regulatoryBody.name);
    reset({
      _id: regulatoryBody._id,
      name: regulatoryBody.name,
    });
  };

  const handleAddRegulatoryBody = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: values });
        toast({ ...toastSuccess, description: 'Regulatory body added' });
        refetch();
      } else {
        toast({ ...toastFailed, description: 'Please complete all the required fields' });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleUpdateRegulatoryBody = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: 'Regulatory body updated' });
        refetch();
      } else {
        toast({ ...toastFailed, description: 'Please complete all the required fields' });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleDeleteRegulatoryBody = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: 'Regulatory body deleted' });
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState('closed');
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (['add', 'edit'].includes(action) && !isFormValid) {
      return toast({ ...toastFailed, description: 'Please complete all the required fields' });
    }
    switch (action) {
      case 'add':
        handleAddRegulatoryBody();
        break;
      case 'edit':
        handleUpdateRegulatoryBody();
        break;
      case 'delete':
        handleDeleteRegulatoryBody();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  return (
    <>
      <AdminModal isOpenModal={adminModalState !== 'closed'} modalType={adminModalState} onAction={handleAction} collection={"regulatory body"}>
        <Flex w='full' align='flex-start' direction='column'>
          <TextInput
            name="name"
            label="Name"
            placeholder='Regulatory body name'
            control={control}
            initialValue={currentRegulatoryBodyName.toLowerCase()}
            validations={{
              notEmpty: true,
              uniqueValue: regulatoryBodies.map(({ name }) => name.toLowerCase())
            }}
          />
        </Flex>
      </AdminModal>
      <Header
        breadcrumbs={["Admin", "Regulatory bodies"]}
        mobileBreadcrumbs={["Regulatory bodies"]}
      />
      <Box p={["0", "0 25px 30px 30px"]} h={["full", "calc(100vh - 160px)"]} overflow="auto">
        <Flex h="full" px={["25px", 0]}>
          <Box w={["full", "full", "calc(100% - 250px)"]} h={['calc(100% - 90px)', 'calc(100% - 35px)']} mr={[0, 0, "50px"]}>
            <AdminTableHeader>
              <AdminTableHeaderElement w={["80%", "50%"]} label="Regulatory body" onClick={() => { setSortType("name"); setSortOrder(!sortOrder); }} sortOrder={sortType === "name" && !sortOrder} showSortingIcon={sortType === "name"} />
              <AdminTableHeaderElement w={["20%", "50%"]} label="Responses count" onClick={() => { setSortType("complianceItemsResponsesCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "complianceItemsResponsesCount" && !sortOrder} showSortingIcon={sortType === "complianceItemsResponsesCount"} />
            </AdminTableHeader>
            <Stack
              bg="white"
              borderBottomRadius="20px"
              spacing="1px"
              pb="5"
              h={loading ? "full" : "fit-content"}
              minH="full"
            >
              {loading ? <Loader center={true} /> :
                regulatoryBodies?.length > 0 ? (
                  regulatoryBodies?.map((regulatoryBody, i) =>
                    <AdminTableRow
                      key={regulatoryBody._id}
                      element={regulatoryBody}
                      responseToEdit="regulatoryBodiesIds"
                      index={i}
                      edit={() => openRegulatoryBodyModal('edit', regulatoryBody)}
                    />
                  )
                ) : (
                  <Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
                    No regulatory bodies found
                  </Flex>
                )}
            </Stack>
          </Box>
          {device === "desktop" &&
            <Flex
              flexDirection="column"
              alignItems="center"
              w={["100%", "220px"]}
            >
              <Flex flexDir="column" w="100%" h="full">
                {regulatoryBodies && <BarChart
                  data={regulatoryBodies.map(({ _id, complianceItemsResponsesCount }) => ({ _id, count: complianceItemsResponsesCount }))}
                  label="Regulatory bodies"
                />}
              </Flex>
            </Flex>
          }
        </Flex>
      </Box>
    </>
  );
};

export default RegulatoryBodies;

export const regulatoryBodiesStyles = {
  regulatoryBodies: {
    fontColor: "#818197",
  }
}
