import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import AdminTableRow from '../../components/Admin/AdminTableRow';
import BarChart from '../../components/BarChart';
import TextInput from '../../components/Forms/TextInput';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import { IBaseWithName } from '../../interfaces/IBaseWithName';

const GET_REGULATORY_BODIES = gql`
  query {
    regulatoryBodies {
      _id
      name
      trackerItemsResponsesCount
    }
  }
`;
const CREATE_REGULATORY_BODY = gql`
  mutation ($name: String!) {
    createRegulatoryBody(name: $name) {
      _id
      name
    }
  }
`;
const UPDATE_REGULATORY_BODY = gql`
  mutation ($values: BaseWithNameModifyInput!) {
    updateRegulatoryBody(regulatoryBodyInput: $values) {
      _id
      name
    }
  }
`;
const DELETE_REGULATORY_BODY = gql`
  mutation ($_id: String!) {
    deleteRegulatoryBody(_id: $_id)
  }
`;

const defaultValues = {
  _id: '',
  name: '',
};

function RegulatoryBodies() {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_REGULATORY_BODIES);
  const [createFunction] = useMutation(CREATE_REGULATORY_BODY);
  const [updateFunction] = useMutation(UPDATE_REGULATORY_BODY);
  const [deleteFunction] = useMutation(DELETE_REGULATORY_BODY);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentRegulatoryBodyName, setCurrentRegulatoryBodyName] = useState<string>('');

  const getRegulatoryBodies = (regulatoryBodiesArray: IBaseWithName[]) => {
    if (!regulatoryBodiesArray) return [];

    return [...regulatoryBodiesArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [regulatoryBodies, setRegulatoryBodies] = useState<IBaseWithName[]>(getRegulatoryBodies(data?.regulatoryBodies));

  useEffect(() => {
    setRegulatoryBodies(getRegulatoryBodies(data?.regulatoryBodies));
  }, [data]);

  useEffect(() => {
    if (sortOrder)
      setRegulatoryBodies([...regulatoryBodies].sort((a, b) => (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString())));
    else
      setRegulatoryBodies([...regulatoryBodies].sort((a, b) => (b[sortType] || 0).toString().localeCompare((a[sortType] || 0).toString())));
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
    if (data?.regulatoryBodies) {
      setRegulatoryBodies([...data.regulatoryBodies].sort((a, b) => {
        const aValue = a[sortType] || '';
        const bValue = b[sortType] || '';
        if (sortType === 'trackerItemsResponsesCount') {
          return sortOrder === 'asc'
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        } 
          return sortOrder === 'asc'
            ? aValue.toString().localeCompare(bValue.toString())
            : bValue.toString().localeCompare(aValue.toString());
        
      }));
    }
  }, [data, sortType, sortOrder]);

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === 'closed') {
      reset(defaultValues);
      setCurrentRegulatoryBodyName('');
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

  const handleUpdateRegulatoryBody = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: 'Regulatory body updated' });
        refetch();
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
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
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

  const handleAddAndReset = async () => {
  try {
    const isValid = await trigger();
    if (!isValid) {
      return toast({
        ...toastFailed,
        description: 'Please complete all the required fields',
      });
    }

    const values = getValues();
    await createFunction({ variables: values });
    toast({ ...toastSuccess, description: 'Regulatory body added' });
    reset(defaultValues);
    setCurrentRegulatoryBodyName('');
    refetch();
  } catch (e: any) {
    toast({ ...toastFailed, description: e.message });
  }
};

  return (
    <>
      <AdminModal
        data-id="030925-4a27c3"
        collection="regulatory body"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndReset : undefined}
      >
        <Flex data-id="030925-53cad4" align="flex-start" direction="column" w="full">
          <TextInput
            data-id="030925-01cc1f"
            control={control}
            initialValue={currentRegulatoryBodyName.toLowerCase()}
            label="Name"
            name="name"
            placeholder="Regulatory body name"
            required
            validations={{
              notEmpty: true,
              uniqueValue: regulatoryBodies.map(({ name }) => name.toLowerCase()),
            }} />
        </Flex>
      </AdminModal>
      <Header
        data-id="030925-2e690e"
        breadcrumbs={['Admin', 'Regulatory bodies']}
        mobileBreadcrumbs={['Regulatory bodies']}
        pageLabel="Regulatory body" />
      <Box
        data-id="030925-7ab56d"
        h={['full', 'calc(100vh - 160px)']}
        overflow="auto"
        p={['0', '0 25px 30px 30px']}>
        <Flex data-id="030925-a5fb9d" h="full" px={['25px', 0]}>
          <Box
             data-id="030925-6cc6b4"
            border="1px solid #CBD5E0"
            h="max-content"
            minH={['calc(100% - 160px)', 'calc(100% - 35px)']}
            mr={[0, 0, '50px']}
            overflow="hidden"
            w={['full', 'full', 'calc(100% - 250px)']}
            >
            <AdminTableHeader data-id="030925-72f0c5">
              <AdminTableHeaderElement
                data-id="030925-ae4401"
                label="Regulatory body"
                onClick={() => {
                  setSortType('name');
                  setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'name'}
                sortOrder={sortType === 'name' ? sortOrder : undefined}
                w={['50%', '50%']} />
              <AdminTableHeaderElement
                data-id="030925-5b6b0e"
                label="Responses count (only published items)"
                onClick={() => {
                  setSortType('trackerItemsResponsesCount');
                  setSortOrder(sortOrder === 'asc' && sortType === 'trackerItemsResponsesCount' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'trackerItemsResponsesCount'}
                sortOrder={sortType === 'trackerItemsResponsesCount' ? sortOrder : undefined}
                w={['50%', '50%']} />
            </AdminTableHeader>
            <Stack
              data-id="030925-c6ca94"
              bg="white"
              borderBottomRadius="20px"
              h={loading ? 'full' : 'fit-content'}
              minH="full"
              pb="5"
              spacing="1px">
              {loading ? (
                <Loader data-id="030925-a2ec2e" center />
              ) : regulatoryBodies?.length > 0 ? (
                regulatoryBodies?.map((regulatoryBody, index) => (
                  <AdminTableRow
                    data-id="030925-031fd9"
                    edit={() => openRegulatoryBodyModal('edit', regulatoryBody)}
                    element={regulatoryBody}
                    index={index}
                    key={regulatoryBody._id}
                    responseToEdit="regulatoryBodiesIds"/>
                ))
              ) : (
                <Flex
                  data-id="030925-e20874"
                  fontSize="18px"
                  fontStyle="italic"
                  h="full"
                  justify="center"
                  mt={4}
                  w="full">
                  No regulatory bodies found
                </Flex>
              )}
            </Stack>
          </Box>
          {device === 'desktop' && (
            <Flex
              data-id="030925-2eacb4"
              alignItems="center"
              flexDirection="column"
              w={['100%', '220px']}>
              <Flex data-id="030925-4316a9" flexDir="column" h="full" w="100%">
                {regulatoryBodies && (
                  <BarChart
                    data-id="030925-3bce3f"
                    data={regulatoryBodies.map(({ _id, trackerItemsResponsesCount }) => ({
                      _id,
                      count: trackerItemsResponsesCount,
                    }))}
                    label="Regulatory bodies" />
                )}
              </Flex>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}

export default RegulatoryBodies;

export const regulatoryBodiesStyles = {
  regulatoryBodies: {
    fontColor: '#818197',
  },
};
