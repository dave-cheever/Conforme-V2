import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';

import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/AdminModal";
import AdminTableRow from "../../components/AdminTableRow";
import Chart from "../../components/Chart";
import Header from "../../components/Header";
import { IBaseWithName } from "../../interfaces/IBaseWithName";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Loader from "../../components/Loader";

const GET_REGULATORY_BODIES = gql`
  query {
    regulatoryBodies {
      _id
      name
      count
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
  mutation ($values: BaseWithNameInput!){
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
  const [regulatoryBodies, setRegulatoryBodies] = useState<IBaseWithName[]>([]);

  const { control, formState: { errors }, getValues, trigger, reset } = useForm({
    mode: 'all',
    defaultValues,
  });

  useEffect(() => {
    if (data?.regulatoryBodies) {
      setRegulatoryBodies([...data.regulatoryBodies].sort((a, b) => a.name.localeCompare(b.name)));
    } else {
      setRegulatoryBodies([]);
    }
  }, [data]);

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openRegulatoryBodyModal = (action: 'edit' | 'delete', regulatoryBody: IBaseWithName) => {
    setAdminModalState(action);
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
            control={control}
            label="Name"
            placeholder='Regulatory body name'
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header
        breadcrumbs={["Admin", "Regulatory bodies"]}
        hideBreadcrumbsOnMobile
      />
      <Box p={["0", "30px"]} h="calc(100vh - 150px)" overflow="auto">
        <Flex flexDirection={["column-reverse", "row"]}>
          <Box w={["100%", "calc(100% - 250px)"]} mr="50px">
            <Flex
              fontWeight="400"
              color="regulatoryBodies.fontColor"
              mb="14px"
              display={["none", "flex"]}
            >
              <Flex w="64%">Regulatory body</Flex>
              <Flex w="25%">Responses count</Flex>
              <Box w="11%" textAlign="right">
                Actions
              </Box>
            </Flex>
            {loading ? (
              <Box mt={20}>
                <Loader />
              </Box>
            ) : (
              <Stack
                borderRadius={["0", "10px"]}
                overflow="hidden"
                spacing={["0", "1px"]}
                mt={["20px", "0"]}
              >
                {regulatoryBodies?.length > 0 ? (
                  regulatoryBodies?.map((regulatoryBody, i) =>
                    <AdminTableRow
                      key={regulatoryBody._id}
                      element={regulatoryBody}
                      index={i}
                      edit={() => openRegulatoryBodyModal('edit', regulatoryBody)}
                      remove={() => openRegulatoryBodyModal('delete', regulatoryBody)}
                    />
                  )
                ) : (
                  <Flex w="full" h="full" fontSize="18px" fontStyle="italic">
                    No regulatory body found
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
              {regulatoryBodies && <Chart items={regulatoryBodies} label="regulatory body" />}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default RegulatoryBodies;
