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
  query ($moduleId: ID!) {
    businessUnits(moduleId: $moduleId) {
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
  const { data, loading, refetch } = useQuery(GET_BUSINESS_UNITS, { variables: { moduleId: module?._id }, skip: !module?._id });
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
      if (sortType === 'owner') {
        return sortOrder === 'asc'
          ? (a.owner?.displayName || '').localeCompare(b.owner?.displayName || '')
          : (b.owner?.displayName || '').localeCompare(a.owner?.displayName || '');
      }

      const aValue = a[sortType];
      const bValue = b[sortType];

      if (typeof aValue === 'string' && typeof bValue === 'string')
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

      const aNum = typeof aValue === 'number' ? aValue : 0;
      const bNum = typeof bValue === 'number' ? bValue : 0;

      return sortOrder === 'asc' ? aNum - bNum : bNum - aNum;
    };

    setBusinessUnits((prevBusinessUnits) => [...prevBusinessUnits].sort(sort));
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
        await createFunction({ variables: { values: { ...values, moduleId: module?._id } } });
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

  const handleAddAndResetBusinessUnit = async () => {
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
      toast({ ...toastSuccess, description: `${capitalize(t('business unit'))} added` });
      reset(defaultValues);
      setCurrentBusinessUnitName('');
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const renderBusinessUnitRow = (businessUnit: IBusinessUnit, i: number) => {
    const rowBg = i % 2 === 0 ? 'white' : 'gray.50';
    return (
      <Flex
        data-id="000393"
        _hover={{ bg: '#F5F7FA' }}
        alignItems="center"
        bg={rowBg}
        borderBottomColor="auditsList.headerBorderColor"
        borderBottomWidth="1px"
        color="auditsList.fontColor"
        cursor="pointer"
        flexShrink={0}
        fontSize="14px"
        fontWeight="500"
        h="50px"
        key={businessUnit._id}
        onClick={() => openBusinessUnitModal('edit', businessUnit)}
        px={2}
        py={4}
        w="full"
      >
        <Flex
          data-id="000394"
          cursor="pointer"
          flexDir="column"
          pl={1}
          w={['70%', '30%']}
        >
          <Text data-id="000395" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {businessUnit.name}
          </Text>
        </Flex>
        {device !== 'mobile' && (
          <Box data-id="000396" w={['30%', '30%']}>
            {businessUnit?.owner?.displayName}
          </Box>
        )}
        {module?.type === 'tracker' && (
          <Flex data-id="000397" align="center" w={['15%', '20%']}>
            <Text data-id="000398">{businessUnit.trackerItemsResponsesCount || 0}</Text>
            <Tooltip data-id="000399" fontSize="md" label="Show Items">
              <ArrowCount
                data-id="000400"
                cursor="pointer"
                h="10px"
                ml="13px"
                onClick={() => {
                  setResponseFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                  navigateTo('/');
                }}
                stroke="#282F36"
                w="10px"
              />
            </Tooltip>
          </Flex>
        )}
        {module?.type === 'audits' && (
          <>
            <Flex data-id="000401" align="center" w={['40%', '20%']}>
              <Text data-id="000402">{businessUnit.totalAnswersCount || 0}</Text>
              <Tooltip data-id="000403" fontSize="md" label="Show Items">
                <ArrowCount
                  data-id="000404"
                  cursor="pointer"
                  h="10px"
                  ml="13px"
                  onClick={() => {
                    setAnswerFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                    navigateTo('/answers');
                  }}
                  stroke="#282F36"
                  w="10px"
                />
              </Tooltip>
            </Flex>
            <Flex data-id="000405" align="center" w={['22%', '20%']}>
              <Text data-id="000406">{businessUnit.totalAuditsCount || 0}</Text>
              <Tooltip data-id="000407" fontSize="md" label="Show Items">
                <ArrowCount
                  data-id="000408"
                  cursor="pointer"
                  h="10px"
                  ml="13px"
                  onClick={() => {
                    setAuditFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                    navigateTo('/dashboard');
                  }}
                  stroke="#282F36"
                  w="10px"
                />
              </Tooltip>
            </Flex>
          </>
        )}
      </Flex>
    );
  };

  return (
    <>
      <AdminModal
        data-id="000409"
        collection={t('business unit')}
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetBusinessUnit : undefined}
      >
        <Stack data-id="000410" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            data-id="000411"
            control={control}
            initialValue={currentBusinessUnitName.toLowerCase()}
            label="Name"
            name="name"
            placeholder="Name"
            required
            validations={{
              notEmpty: true,
              uniqueValue: businessUnits.map(({ name }) => name.toLowerCase()),
            }}
          />
          <PeoplePicker data-id="000412" control={control} label="Owner" name="ownerId" placeholder="Name" showAsDropdown={false} />
        </Stack>
      </AdminModal>
      <Header
        data-id="000413"
        breadcrumbs={['Admin', pluralize(capitalize(t('business unit')))]}
        mobileBreadcrumbs={[pluralize(capitalize(t('business unit')))]}
        pageLabel={capitalize(t('business unit'))}
      />
      <Box
        data-id="000414"
        bg="auditsList.bg"
        borderRadius="10px"
        h="calc(100vh - 160px)"
        p={['0', '0 25px 30px 30px']}
      >
        <Flex data-id="000415" h="full" px={['25px', 0]}>
          <Box
            data-id="000416"
            border="1px solid"
            borderColor="auditsList.headerBorderColor"
            h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            overflow="hidden"
            w={['full', 'full', 'calc(100%)']}
          >
          <AdminTableHeader data-id="000417">
            <AdminTableHeaderElement
              data-id="000418"
              label={`${capitalize(t('business unit'))} name`}
              onClick={() => {
                setSortType('name');
                setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
              }}
              showSortingIcon={sortType === 'name'}
              sortOrder={sortType === 'name' ? sortOrder : undefined}
              w={['70%', '30%']}
            />
            {device !== 'mobile' && (
              <AdminTableHeaderElement
                data-id="000419"
                label="Owner"
                onClick={() => {
                  setSortType('owner');
                  setSortOrder(sortOrder === 'asc' && sortType === 'owner' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'owner'}
                sortOrder={sortType === 'owner' ? sortOrder : undefined}
                w={['30%', '30%']}
              />
            )}
            {module?.type === 'tracker' ? (
              <AdminTableHeaderElement
                data-id="000420"
                label="Responses count"
                onClick={() => {
                  setSortType('trackerItemsResponsesCount');
                  setSortOrder(sortOrder === 'asc' && sortType === 'trackerItemsResponsesCount' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'trackerItemsResponsesCount'}
                sortOrder={sortType === 'trackerItemsResponsesCount' ? sortOrder : undefined}
                tooltip="Only published items"
                w={['15%', '20%']}
              />
            ) : (
              <>
                <AdminTableHeaderElement
                  data-id="000421"
                  label={`${capitalize(pluralize(t('question')))} count`}
                  onClick={() => {
                    setSortType('totalAnswersCount');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'totalAnswersCount'}
                  sortOrder={sortType === 'totalAnswersCount' && sortType === 'totalAnswersCount' ? sortOrder : undefined}
                  w={['40%', '20%']}
                />
                <AdminTableHeaderElement
                  data-id="000422"
                  label={`${capitalize(pluralize(t('audit')))} count`}
                  onClick={() => {
                    setSortType('totalAuditsCount');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'totalAuditsCount'}
                  sortOrder={sortType === 'totalAuditsCount' && sortType === 'totalAuditsCount' ? sortOrder : undefined}
                  w={['20%', '20%']}
                />
              </>
            )}
          </AdminTableHeader>
          <Box data-id="000423" bg="auditsList.bg" borderBottomRadius="10px" h="full" overflow="auto" w="full">
            {loading ? (
              <Loader data-id="000424" center />
            ) : businessUnits?.length > 0 ? (
              businessUnits?.map(renderBusinessUnitRow)
            ) : (
              <Flex data-id="000425" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                No {pluralize(t('business unit'))} found
              </Flex>
            )}
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default BusinessUnits;

export const businessUnitsStyles = {
  businessUnit: {
    binIconColor: '#FC5960',
    fontColor: '#818197',
  },
};
