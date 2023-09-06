import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import PeoplePicker from '../../components/Forms/PeoplePicker';
import TextInput from '../../components/Forms/TextInput';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { useAdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import { useFiltersContext } from '../../contexts/FiltersProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import { ArrowCount } from '../../icons';
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';

const GET_BUSINESS_UNITS = gql`
  query {
    businessUnits {
      _id
      name
      ownerId
      owner {
        displayName
      }
      imgUrl
      trackerItemsResponsesCount
      totalAnswersCount
      totalAuditsCount
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
  name: '',
  ownerId: '',
};

function BusinessUnits() {
  const toast = useToast();
  const { module } = useAppContext();
  const { adminModalState, setAdminModalState } = useAdminContext();
  const { setResponseFiltersValue, setAnswerFiltersValue, setAuditFiltersValue } = useFiltersContext();
  const { data, loading, refetch } = useQuery(GET_BUSINESS_UNITS);
  const [createFunction] = useMutation(CREATE_BUSINESS_UNIT);
  const [updateFunction] = useMutation(UPDATE_BUSINESS_UNIT);
  const [deleteFunction] = useMutation(DELETE_BUSINESS_UNIT);
  const device = useDevice();
  const { navigateTo } = useNavigate();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentBusinessUnitName, setCurrentBusinessUnitName] = useState<string>('');

  const getBusinessUnits = (businessUnitsArray: IBusinessUnit[]) => {
    if (!businessUnitsArray) return [];

    return [...businessUnitsArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [businessUnits, setBusinessUnits] = useState<IBusinessUnit[]>(getBusinessUnits(data?.businessUnits));

  useEffect(() => {
    setBusinessUnits(getBusinessUnits(data?.businessUnits));
  }, [data]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner') return (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '');

      return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString());
    };
    if (sortOrder) setBusinessUnits([...businessUnits].sort((a, b) => sort(a, b)));
    else setBusinessUnits([...businessUnits].sort((a, b) => sort(b, a)));
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
    if (adminModalState === 'closed') {
      reset(defaultValues);
      setCurrentBusinessUnitName('');
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openBusinessUnitModal = (action: 'edit' | 'delete', businessUnit: IBusinessUnit) => {
    setAdminModalState(action);
    setCurrentBusinessUnitName(businessUnit?.name);
    reset({
      _id: businessUnit?._id,
      name: businessUnit?.name,
      ownerId: businessUnit?.ownerId,
    });
  };

  const handleAddBusinessUnit = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: { values } });
        refetch();
        toast({ ...toastSuccess, description: `${capitalize(t('business unit'))} added` });
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

  const handleUpdateBusinessUnit = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        refetch();
        toast({ ...toastSuccess, description: `${capitalize(t('business unit'))} updated` });
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

  const handleDeleteBusinessUnit = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      refetch();
      toast({ ...toastSuccess, description: `${capitalize(t('business unit'))} deleted` });
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
        handleAddBusinessUnit();
        break;
      case 'edit':
        handleUpdateBusinessUnit();
        break;
      case 'delete':
        handleDeleteBusinessUnit();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const renderBusinessUnitRow = (businessUnit: IBusinessUnit, i: number) => (
    <Flex
      alignItems="center"
      bg="#FFFFFF"
      borderBottomRadius={i === businessUnits.length - 1 ? 'lg' : ''}
      boxShadow="sm"
      data-id="c76b0bf9921a"
      flexShrink={0}
      h="73px"
      key={businessUnit._id}
      mb="1px"
      p={4}
      w="full">
      <Flex
        cursor="pointer"
        data-id="62602cb9c5b0"
        flexDir="column"
        mr={4}
        onClick={() => openBusinessUnitModal('edit', businessUnit)}
        pl={1}
        w={['80%', '30%']}>
        <Text
          data-id="265ac9aaf161"
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap">
          {businessUnit.name}
        </Text>
      </Flex>
      {device !== 'mobile' && (
        <Box data-id="d169dd4443da" w="calc(70% / 2)">{businessUnit?.owner?.displayName}</Box>
      )}
      {module?.type === 'tracker' && (
        <Flex align="center" data-id="038185a293c7" w={['20%', 'calc(70% / 2)']}>
          <Text data-id="325510124911">{businessUnit.trackerItemsResponsesCount || 0}</Text>
          <Tooltip data-id="a70f6f28c413" fontSize="md" label="Show Items">
            <ArrowCount
              cursor="pointer"
              data-id="315701a99129"
              h="10px"
              ml="13px"
              onClick={() => {
                setResponseFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                navigateTo('/');
              }}
              stroke="#282F36"
              w="10px" />
          </Tooltip>
        </Flex>
      )}
      {module?.type === 'audits' && (
        <>
          <Flex align="center" data-id="db85ba830398" w={['20%', 'calc(70% / 2)']}>
            <Text data-id="49560825d319">{businessUnit.totalAnswersCount || 0}</Text>
            <Tooltip data-id="1070df803807" fontSize="md" label="Show Items">
              <ArrowCount
                cursor="pointer"
                data-id="08e28509876b"
                h="10px"
                ml="13px"
                onClick={() => {
                  setAnswerFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                  navigateTo('/answers');
                }}
                stroke="#282F36"
                w="10px" />
            </Tooltip>
          </Flex>
          <Flex align="center" data-id="55e68fa3ad52" w={['20%', 'calc(70% / 2)']}>
            <Text data-id="efecbaf85dda">{businessUnit.totalAuditsCount || 0}</Text>
            <Tooltip data-id="ed7dabf6e0b7" fontSize="md" label="Show Items">
              <ArrowCount
                cursor="pointer"
                data-id="c44227d82bbf"
                h="10px"
                ml="13px"
                onClick={() => {
                  setAuditFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                  navigateTo('/dashboard');
                }}
                stroke="#282F36"
                w="10px" />
            </Tooltip>
          </Flex>
        </>
      )}
    </Flex>
  );

  return (<>
    <AdminModal
      collection={t('business unit')}
      data-id="f27643991a09"
      isOpenModal={adminModalState !== 'closed'}
      modalType={adminModalState}
      onAction={handleAction}>
      <Stack
        data-id="a4243ef9e5cd"
        spacing={2}
        w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
        <TextInput
          control={control}
          data-id="2059c276d1a1"
          initialValue={currentBusinessUnitName.toLowerCase()}
          label="Name"
          name="name"
          placeholder="Name"
          validations={{
            notEmpty: true,
            uniqueValue: businessUnits.map(({ name }) => name.toLowerCase()),
          }} />
        <PeoplePicker
          control={control}
          data-id="2151fa34ef8e"
          label="Owner"
          name="ownerId"
          placeholder="Name"
          showAsDropdown={false} />
      </Stack>
    </AdminModal>
    <Header
      breadcrumbs={['Admin', pluralize(capitalize(t('business unit')))]}
      data-id="ac1ee3c30cc8"
      mobileBreadcrumbs={[pluralize(capitalize(t('business unit')))]} />
    <Flex
      data-id="33879bce2f4d"
      h="calc(100vh - 160px)"
      overflow="auto"
      px={['25px', 0]}>
      <Box
        data-id="71b1095147a4"
        h={['calc(100% - 160px)', 'calc(100% - 35px)']}
        p={[0, '0 25px 30px 30px']}
        w="full">
        <AdminTableHeader data-id="fc13c9d295b4">
          <AdminTableHeaderElement
            data-id="ba04d2d0810b"
            label={`${capitalize(t('business unit'))} name`}
            onClick={() => {
              setSortType('name');
              setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
            }}
            showSortingIcon={sortType === 'name'}
            sortOrder={sortType === 'name' ? sortOrder : undefined}
            w={['80%', '30%']} />
          {device !== 'mobile' && (
            <AdminTableHeaderElement
              data-id="9e47b1978e0d"
              label="Owner"
              onClick={() => {
                setSortType('owner');
                setSortOrder(sortOrder === 'asc' && sortType === 'owner' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'owner'}
              sortOrder={sortType === 'owner' ? sortOrder : undefined}
              w="calc(70% / 2)" />
          )}
          {module?.type === 'tracker' ? (
            <AdminTableHeaderElement
              data-id="6074f7bf737f"
              label="Responses count"
              onClick={() => {
                setSortType('trackerItemsResponsesCount');
                setSortOrder(sortOrder === 'asc' && sortType === 'trackerItemsResponsesCount' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'trackerItemsResponsesCount'}
              sortOrder={sortType === 'trackerItemsResponsesCount' ? sortOrder : undefined}
              tooltip="Only published items"
              w={['20%', 'calc(70% / 2)']} />
          ) : (
            <>
              <AdminTableHeaderElement
                data-id="14fe17021f88"
                label={`${capitalize(pluralize(t('question')))} count`}
                onClick={() => {
                  setSortType('totalAnswersCount');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'totalAnswersCount'}
                sortOrder={sortType === 'totalAnswersCount' && sortType === 'totalAnswersCount' ? sortOrder : undefined}
                w={['20%', 'calc(70% / 2)']} />
              <AdminTableHeaderElement
                data-id="939037a384ef"
                label={`${capitalize(pluralize(t('audit')))} count`}
                onClick={() => {
                  setSortType('totalAuditsCount');
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'totalAuditsCount'}
                sortOrder={sortType === 'totalAuditsCount' && sortType === 'totalAuditsCount' ? sortOrder : undefined}
                w={['20%', 'calc(70% / 2)']} />
            </>
          )}
        </AdminTableHeader>
        <Flex
          bg="white"
          borderBottomRadius="20px"
          data-id="3ab58dd63565"
          flexDir="column"
          fontSize="smm"
          h="full"
          overflow="auto"
          w="full">
          {loading ? (
            <Loader center data-id="f338242108dc" />
          ) : businessUnits?.length > 0 ? (
            businessUnits?.map(renderBusinessUnitRow)
          ) : (
            <Flex
              data-id="794f2811e3b3"
              fontSize="18px"
              fontStyle="italic"
              h="full"
              justify="center"
              mt={4}
              w="full">
              No {pluralize(t('business unit'))} found
            </Flex>
          )}
        </Flex>
      </Box>
    </Flex>
  </>);
}

export default BusinessUnits;

export const businessUnitsStyles = {
  businessUnit: {
    binIconColor: '#FC5960',
    fontColor: '#818197',
  },
};
