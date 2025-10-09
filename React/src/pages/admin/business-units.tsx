import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, Tooltip, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import PeoplePicker from '../../components/Forms/PeoplePicker';
import TextInput from '../../components/Forms/TextInput';
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
import { IBusinessUnit } from '../../interfaces/IBusinessUnit';
import TextCell from '../../components/Table/Cells/TextCell';

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

  const columns: ColumnConfig[] = [
    {
      label: `${capitalize(t('business unit'))} name`,
      sortKey: 'name',
      width: '40%',
      dataId: '000418',
      render: (businessUnit: IBusinessUnit) => (
        <TextCell data-id="002093" text={businessUnit.name} />
      ),
    },
    {
      label: 'Owner',
      sortKey: 'owner',
      width: '30%',
      dataId: '000419',
      disabled: device === 'mobile' || device === 'tablet',
      render: (businessUnit: IBusinessUnit) => <AvatarCell data-id="001905" users={businessUnit.owner ? [businessUnit.owner] : []} />,
    },
    ...(module?.type === 'tracker'
      ? [
          {
            label: 'Responses count',
            sortKey: 'trackerItemsResponsesCount',
            width: '30%',
            dataId: '000420',
            tooltip: 'Only published items',
            render: (businessUnit: IBusinessUnit) => (
              <Flex
                data-id="001906"
                alignItems="center"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500">
                {businessUnit.trackerItemsResponsesCount || 0}
                <Tooltip data-id="001907" fontSize="md" label="Show Items">
                  <ArrowCount
                    data-id="001908"
                    cursor="pointer"
                    h="10px"
                    ml="13px"
                    onClick={(e) => {
                      e.stopPropagation();
                      setResponseFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                      navigateTo('/');
                    }}
                    stroke="#282F36"
                    w="10px" />
                </Tooltip>
              </Flex>
            ),
          },
        ]
      : [
          {
            label: `${capitalize(pluralize(t('question')))} count`,
            sortKey: 'totalAnswersCount',
            width: '15%',
            dataId: '000421',
            render: (businessUnit: IBusinessUnit) => (
              <Flex
                data-id="001909"
                alignItems="center"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500">
                {businessUnit.totalAnswersCount || 0}
                <Tooltip data-id="001910" fontSize="md" label="Show Items">
                  <ArrowCount
                    data-id="001911"
                    cursor="pointer"
                    h="10px"
                    ml="13px"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnswerFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                      navigateTo('/answers');
                    }}
                    stroke="#282F36"
                    w="10px" />
                </Tooltip>
              </Flex>
            ),
          },
          {
            label: `${capitalize(pluralize(t('audit')))} count`,
            sortKey: 'totalAuditsCount',
            width: '15%',
            dataId: '000422',
            render: (businessUnit: IBusinessUnit) => (
              <Flex
                data-id="001912"
                alignItems="center"
                color="auditsList.fontColor"
                fontSize="14px"
                fontWeight="500">
                {businessUnit.totalAuditsCount || 0}
                <Tooltip data-id="001913" fontSize="md" label="Show Items">
                  <ArrowCount
                    data-id="001914"
                    cursor="pointer"
                    h="10px"
                    ml="13px"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAuditFiltersValue({ businessUnitsIds: { value: [businessUnit._id] } });
                      navigateTo('/dashboard');
                    }}
                    stroke="#282F36"
                    w="10px" />
                </Tooltip>
              </Flex>
            ),
          },
        ]),
  ];

  return (
    <>
      <AdminModal
        collection={t('business unit')}
        data-id="000409"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetBusinessUnit : undefined}
      >
        <Stack data-id="000410" spacing={2} w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}>
          <TextInput
            control={control}
            data-id="000411"
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
          <PeoplePicker control={control} data-id="000412" label="Owner" name="ownerId" placeholder="Name" showAsDropdown={false} />
        </Stack>
      </AdminModal>
      <Header
        breadcrumbs={['Admin', pluralize(capitalize(t('business unit')))]}
        data-id="000413"
        mobileBreadcrumbs={[pluralize(capitalize(t('business unit')))]}
        pageLabel={capitalize(t('business unit'))}
      />
      <Box
        bg="auditsList.bg"
        data-id="000414"
        h="full"
        overflow="hidden"
      >
        <Flex data-id="000415" h="full" px={['25px', 0]}>
          {loading ? (
            <Box bg="white" borderBottomRadius="10px" data-id="000423" h="full" w="full">
              <Loader center data-id="000424" />
            </Box>
          ) : (
            <ListView
              columns={columns}
              data={businessUnits}
              data-id="000444"
              dataType="business units"
              onRowClick={(row: IBusinessUnit) => openBusinessUnitModal('edit', row)}
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

export default BusinessUnits;

export const businessUnitsStyles = {
  businessUnit: {
    binIconColor: '#FC5960',
    fontColor: '#818197',
  },
};
