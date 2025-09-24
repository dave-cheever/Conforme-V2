import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Spacer, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

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
import { useAdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import { ILocation } from '../../interfaces/ILocation';

const GET_LOCATIONS = gql`
  query ($moduleId: ID!) {
    locations(moduleId: $moduleId) {
      _id
      name
      ownerId
      organizationId
      notes
      owner {
        displayName
        imgUrl
      }
      trackerItemsResponsesCount
      totalAuditsCount
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

function Locations() {
  const toast = useToast();
  const { module } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { data, loading, refetch } = useQuery(GET_LOCATIONS, { variables: { moduleId: module?._id }, skip: !module?._id });
  const [createFunction] = useMutation(CREATE_LOCATION);
  const [updateFunction] = useMutation(UPDATE_LOCATION);
  const [deleteFunction] = useMutation(DELETE_LOCATION);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentLocationName, setCurrentLocationName] = useState<string>('');

  const getLocations = (locationsArray: ILocation[]) => {
    if (!locationsArray) return [];

    return [...locationsArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [locations, setLocations] = useState<ILocation[]>(getLocations(data?.locations));

  useEffect(() => {
    setLocations(getLocations(data?.locations));
  }, [data]);

  useEffect(() => {
    if (!data?.locations) return;

    const sort = (a, b) => {
      let result;
      if (sortType === 'owner') result = (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');
      else if (sortType === 'notes') result = (a.notes || '-').localeCompare(b.notes || '-');
      else result = (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());

      return sortOrder === 'asc' ? result : -result;
    };

    setLocations([...data.locations].sort((a, b) => sort(a, b)));
  }, [sortType, sortOrder, data]);

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
      setCurrentLocationName('');
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openLocationModal = (action: 'edit' | 'delete', location: ILocation) => {
    setAdminModalState(action);
    setCurrentLocationName(location.name);
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
        await createFunction({ variables: { values: { ...values, moduleId: module?._id } } });
        toast({ ...toastSuccess, description: `${capitalize(t('location'))} added` });
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
        toast({ ...toastSuccess, description: `${capitalize(t('location'))} updated` });
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
      toast({ ...toastSuccess, description: `${capitalize(t('location'))} deleted` });
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

  const handleAddAndResetLocation = async () => {
    try {
      const isValid = await trigger();
      if (!isValid) {
        return toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }

      const values = getValues();
      await createFunction({ variables: { values: { ...values, moduleId: module?._id } } });
      toast({ ...toastSuccess, description: `${capitalize(t('location'))} added` });
      reset(defaultValues);
      setCurrentLocationName('');
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  return (
    <>
      <AdminModal
        data-id="000426"
        collection={t('location')}
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetLocation : undefined}
      >
        <Flex data-id="000427" align="flex-start" direction="column" w={['full', '70%']}>
          <TextInput
            data-id="000428"
            control={control}
            initialValue={currentLocationName.toLowerCase()}
            label={`${capitalize(t('location'))} name`}
            name="name"
            placeholder="e.g. London"
            required
            validations={{
              notEmpty: true,
              uniqueValue: locations.map(({ name }) => name.toLowerCase()),
            }}
          />
          <TextInputMultiline data-id="000429" control={control} label="Notes" name="notes" placeholder="Add your notes here" />
          <PeoplePicker
            data-id="000430"
            control={control}
            label="Owner"
            name="ownerId"
            placeholder="Name"
            required
            showAsDropdown={false}
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header data-id="000431" breadcrumbs={['Admin', pluralize(capitalize(t('location')))]} pageLabel={capitalize(t('location'))} />
      <Box
        data-id="000432"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        p={['0', '0 25px 30px 30px']}
      >
        <Flex data-id="000433" h="full" px={['25px', 0]}>
          <Box
            data-id="000434"
            border="1px solid"
            borderColor="auditsList.headerBorderColor"
            h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            overflow="hidden"
            w={['full', 'full', 'calc(100%)']}
          >
            <AdminTableHeader data-id="000435">
              <AdminTableHeaderElement
                data-id="000436"
                label={`${capitalize(t('location'))} name`}
                onClick={() => {
                  setSortType('name');
                  setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'name'}
                sortOrder={sortType === 'name' ? sortOrder : undefined}
                w={['max-content', '50%']}
              />
              {device !== 'mobile' && device !== 'tablet' && (
                <>
                  <AdminTableHeaderElement
                    data-id="000437"
                    label="Notes"
                    onClick={() => {
                      setSortType('notes');
                      setSortOrder(sortOrder === 'asc' && sortType === 'notes' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sortType === 'notes'}
                    sortOrder={sortType === 'notes' ? sortOrder : undefined}
                    w={['100%', '50%']}
                  />
                  <AdminTableHeaderElement
                    data-id="000438"
                    label="Owner"
                    onClick={() => {
                      setSortType('owner');
                      setSortOrder(sortOrder === 'asc' && sortType === 'owner' ? 'desc' : 'asc');
                    }}
                    showSortingIcon={sortType === 'owner'}
                    sortOrder={sortType === 'owner' ? sortOrder : undefined}
                    w={['100%', '50%']}
                  />
                </>
              )}
              <Spacer data-id="000439" display={['block', 'none']} />
              {module?.type === 'tracker' ? (
                <AdminTableHeaderElement
                  data-id="000440"
                  label="Responses count"
                  onClick={() => {
                    setSortType('trackerItemsResponsesCount');
                    setSortOrder(sortOrder === 'asc' && sortType === 'trackerItemsResponsesCount' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'trackerItemsResponsesCount'}
                  sortOrder={sortType === 'trackerItemsResponsesCount' ? sortOrder : undefined}
                  tooltip="Only published items"
                  w={['max-content', '50%']}
                />
              ) : (
                <AdminTableHeaderElement
                  data-id="000441"
                  label={`${capitalize(pluralize(t('audit')))} count`}
                  onClick={() => {
                    setSortType('totalAuditsCount');
                    setSortOrder(sortOrder === 'asc' && sortType === 'totalAuditsCount' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'totalAuditsCount'}
                  sortOrder={sortType === 'totalAuditsCount' ? sortOrder : undefined}
                  w={['max-content', '50%']}
                />
              )}
            </AdminTableHeader>

            {loading ? (
              <Box data-id="000442" bg="white" borderBottomRadius="10px" h="full" w="full">
                <Loader data-id="000443" center />
              </Box>
            ) : (
              <Box data-id="000444" bg="auditsList.bg" borderBottomRadius="10px" h="full" overflow="auto">
                {locations?.length > 0 ? (
                  locations?.map((location, i) => (
                    <LocationListItem data-id="000445" index={i} key={i} location={location} openLocationModal={openLocationModal} />
                  ))
                ) : (
                  <Flex data-id="000446" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                    No {pluralize(t('location'))} found
                  </Flex>
                )}
              </Box>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default Locations;

export const locationsStyles = {
  locations: {
    fontColor: '#818197',
    tooltipStroke: '#282F36',
  },
};
