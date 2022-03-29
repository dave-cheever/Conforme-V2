import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Spacer, Stack, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import PeoplePicker from '../../components/Forms/PeoplePicker';
import TextInput from '../../components/Forms/TextInput';
import TextInputMultiline from '../../components/Forms/TextInputMultiline';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import LocationListItem from '../../components/LocationListItem';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
import { ILocation } from '../../interfaces/ILocation';

const GET_LOCATIONS = gql`
  query {
    locations {
      _id
      name
      ownerId
      organizationId
      notes
      owner {
        displayName
        imgUrl
      }
      complianceItemsResponsesCount
    }
  }
`;
const CREATE_LOCATION = gql`
  mutation ($values: LocationInput!) {
    createLocation(locationInput: $values) {
      _id
    }
  }
`;
const UPDATE_LOCATION = gql`
  mutation ($values: LocationModifyInput!) {
    updateLocation(locationModifyInput: $values) {
      _id
    }
  }
`;
const DELETE_LOCATION = gql`
  mutation ($_id: String!) {
    deleteLocation(_id: $_id)
  }
`;

const defaultValues: Partial<ILocation> = {
  _id: undefined,
  name: '',
  ownerId: '',
  notes: '',
};

const Sites = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_LOCATIONS);
  const [createFunction] = useMutation(CREATE_LOCATION);
  const [updateFunction] = useMutation(UPDATE_LOCATION);
  const [deleteFunction] = useMutation(DELETE_LOCATION);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState(true);

  const getLocations = (locationsArray: ILocation[]) => {
    if (!locationsArray) return [];

    return [...locationsArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [locations, setLocations] = useState<ILocation[]>(
    getLocations(data?.locations),
  );

  useEffect(() => {
    setLocations(getLocations(data?.locations));
  }, [data]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner') {
        return (a.owner?.displayName || '').localeCompare(
          b.owner?.displayName || '',
        );
      }
      if (sortType === 'notes')
        return (a.notes || '-').localeCompare(b.notes || '-');
      return (a[sortType] || 0)
        .toString()
        .localeCompare((b[sortType] || 0).toString());
    };
    if (sortOrder) setLocations([...locations].sort((a, b) => sort(a, b)));
    else setLocations([...locations].sort((a, b) => sort(b, a)));
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openLocationModal = (
    action: 'edit' | 'delete',
    location: ILocation,
  ) => {
    setAdminModalState(action);
    reset({
      _id: location._id,
      name: location.name,
      ownerId: location.ownerId,
      notes: location.notes,
    });
  };

  const handleAddLocation = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: { values } });
        toast({ ...toastSuccess, description: 'Site added' });
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

  const handleUpdateLocation = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: 'Site updated' });
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

  const handleDeleteLocation = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: 'Site deleted' });
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
        handleAddLocation();
        break;
      case 'edit':
        handleUpdateLocation();
        break;
      case 'delete':
        handleDeleteLocation();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  return (
    <>
      <AdminModal
        collection="site"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
      >
        <Flex align="flex-start" direction="column" w={['full', '70%']}>
          <TextInput
            control={control}
            label="Site name"
            name="name"
            placeholder="e.g. London"
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline
            control={control}
            label="Notes"
            name="notes"
            placeholder="Add your notes here"
          />
          <PeoplePicker
            control={control}
            label="Owner"
            name="ownerId"
            placeholder="Select"
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Sites']} />
      <Box h="calc(100vh - 160px)" p={['0', '0 25px 30px 30px']}>
        <Flex h="full" px={['25px', 0]}>
          <Box
            h={['calc(100% - 170px)', 'calc(100% - 35px)']}
            mr={[0, 0, '50px']}
            w={['full', 'full', 'calc(100%)']}
          >
            <AdminTableHeader>
              <AdminTableHeaderElement
                label="Site name"
                onClick={() => {
                  setSortType('name');
                  setSortOrder(!sortOrder);
                }}
                showSortingIcon={sortType === 'name'}
                sortOrder={sortType === 'name' && !sortOrder}
                w={['max-content', '50%']}
              />
              {device !== 'mobile' && device !== 'tablet' && (
                <>
                  <AdminTableHeaderElement
                    label="Notes"
                    onClick={() => {
                      setSortType('notes');
                      setSortOrder(!sortOrder);
                    }}
                    showSortingIcon={sortType === 'notes'}
                    sortOrder={sortType === 'notes' && !sortOrder}
                    w={['100%', '50%']}
                  />
                  <AdminTableHeaderElement
                    label="Owner"
                    onClick={() => {
                      setSortType('owner');
                      setSortOrder(!sortOrder);
                    }}
                    showSortingIcon={sortType === 'owner'}
                    sortOrder={sortType === 'owner' && !sortOrder}
                    w={['100%', '50%']}
                  />
                </>
              )}
              <Spacer display={['block', 'none']} />
              <AdminTableHeaderElement
                label="No. of responses"
                onClick={() => {
                  setSortType('complianceItemsResponsesCount');
                  setSortOrder(!sortOrder);
                }}
                showSortingIcon={sortType === 'complianceItemsResponsesCount'}
                sortOrder={
                  sortType === 'complianceItemsResponsesCount' && !sortOrder
                }
                w={['max-content', '50%']}
              />
            </AdminTableHeader>

            {loading ? (
              <Box bg="white" borderBottomRadius="10px" h="full" w="full">
                <Loader center />
              </Box>
            ) : (
              <Stack
                bg="white"
                borderBottomRadius="10px"
                h="full"
                overflow="auto"
                spacing="1px"
              >
                {locations?.length > 0 ? (
                  locations?.map((location, i) => (
                    <LocationListItem
                      key={i}
                      location={location}
                      openLocationModal={openLocationModal}
                    />
                  ))
                ) : (
                  <Flex
                    fontSize="18px"
                    fontStyle="italic"
                    h="full"
                    justify="center"
                    mt={4}
                    w="full"
                  >
                    No sites found
                  </Flex>
                )}
              </Stack>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Sites;
