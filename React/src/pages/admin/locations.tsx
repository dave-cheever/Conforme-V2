import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import PeoplePicker from '../../components/Forms/PeoplePicker';
import TextInput from '../../components/Forms/TextInput';
import TextInputMultiline from '../../components/Forms/TextInputMultiline';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import AvatarCell from '../../components/Table/Cells/AvatarCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { useAdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import { ArrowCount } from '../../icons';
import { ILocation } from '../../interfaces/ILocation';
import TextCell from '../../components/Table/Cells/TextCell';

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
  const { navigateTo } = useNavigate();
  const { setResponseFiltersValue, setAuditFiltersValue } = useFiltersContext();
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

  const columns: ColumnConfig[] = [
    {
      label: `${capitalize(t('location'))} name`,
      sortKey: 'name',
      width: '40%',
      dataId: '000436',
      render: (location: ILocation) => (
        <TextCell data-id="002094" text={location.name} />
      ),
    },
    {
      label: 'Notes',
      sortKey: 'notes',
      width: '30%',
      dataId: '000437',
      disabled: device === 'mobile' || device === 'tablet',
      render: (location: ILocation) => (
        <TextCell data-id="002095" text={location.notes} />
      ),
    },
    {
      label: 'Owner',
      sortKey: 'owner',
      width: '20%',
      dataId: '000438',
      disabled: device === 'mobile' || device === 'tablet',
      render: (location: ILocation) => <AvatarCell data-id="001944" users={location.owner ? [location.owner] : []} />,
    },
    {
      label: module?.type === 'tracker' ? 'Responses count' : `${capitalize(pluralize(t('audit')))} count`,
      sortKey: module?.type === 'tracker' ? 'trackerItemsResponsesCount' : 'totalAuditsCount',
      width: '10%',
      dataId: '000441',
      tooltip: module?.type === 'tracker' ? 'Only published items' : undefined,
      render: (location: ILocation) => (
        <Flex
          data-id="001945"
          alignItems="center"
          color="auditsList.fontColor"
          fontSize="14px"
          fontWeight="500">
          {module?.type === 'tracker' ? location.trackerItemsResponsesCount || 0 : location.totalAuditsCount || 0}
          <ArrowCount
            cursor="pointer"
            data-id="000336"
            h="10px"
            ml="13px"
            onClick={(e) => {
              e.stopPropagation();
              if (module?.type === 'tracker') setResponseFiltersValue({ locationsIds: { value: [location._id] } });
              else setAuditFiltersValue({ locationsIds: { value: [location._id] } });
              navigateTo('/');
            }}
            stroke="locations.tooltipStroke"
            w="10px"
          />
        </Flex>
      ),
    },
  ];

  return (
    <>
      <AdminModal
        collection={t('location')}
        data-id="000426"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetLocation : undefined}
      >
        <Flex align="flex-start" data-id="000427" direction="column" w={['full', '70%']}>
          <TextInput
            control={control}
            data-id="000428"
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
          <TextInputMultiline control={control} data-id="000429" label="Notes" name="notes" placeholder="Add your notes here" />
          <PeoplePicker
            control={control}
            data-id="000430"
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
      <Header breadcrumbs={['Admin', pluralize(capitalize(t('location')))]} data-id="000431" pageLabel={capitalize(t('location'))} />
      <Box
        bg="auditsList.bg"
        data-id="000432"
        h="full"
        overflow="hidden"
      >
        <Flex data-id="000433" h="full" px={['25px', 0]}>
          {loading ? (
            <Box bg="white" borderBottomRadius="10px" data-id="000442" h="full" w="full">
              <Loader center data-id="000443" />
            </Box>
          ) : (
            <ListView
              columns={columns}
              data={locations}
              data-id="000444"
              dataType="locations"
              onRowClick={(row: ILocation) => openLocationModal('edit', row)}
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          )}
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
