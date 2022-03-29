import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, Stack, Text, Tooltip, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import AdminTableHeader from '../../components/Admin/AdminTableHeader';
import AdminTableHeaderElement from '../../components/Admin/AdminTableHeaderElement';
import PeoplePicker from '../../components/Forms/PeoplePicker';
import TextInput from '../../components/Forms/TextInput';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import { AdminContext } from '../../contexts/AdminProvider';
import useDevice from '../../hooks/useDevice';
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
      complianceItemsResponsesCount
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

const Areas = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_BUSINESS_UNITS);
  const [createFunction] = useMutation(CREATE_BUSINESS_UNIT);
  const [updateFunction] = useMutation(UPDATE_BUSINESS_UNIT);
  const [deleteFunction] = useMutation(DELETE_BUSINESS_UNIT);
  const device = useDevice();
  const history = useHistory();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState(true);

  const getBusinessUnits = (businessUnitsArray: IBusinessUnit[]) => {
    if (!businessUnitsArray) return [];

    return [...businessUnitsArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [businessUnits, setBusinessUnits] = useState<IBusinessUnit[]>(
    getBusinessUnits(data?.businessUnits),
  );

  useEffect(() => {
    setBusinessUnits(getBusinessUnits(data?.businessUnits));
  }, [data]);

  useEffect(() => {
    const sort = (a, b) => {
      if (sortType === 'owner') {
        return (a.owner?.displayName || '').localeCompare(
          b.owner?.displayName || '',
        );
      }

      return (a[sortType] || 0)
        .toString()
        .localeCompare((b[sortType] || 0).toString());
    };
    if (sortOrder)
      setBusinessUnits([...businessUnits].sort((a, b) => sort(a, b)));
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
    if (adminModalState === 'closed') reset(defaultValues);
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openBusinessUnitModal = (
    action: 'edit' | 'delete',
    businessUnit: IBusinessUnit,
  ) => {
    setAdminModalState(action);
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
        toast({ ...toastSuccess, description: 'Area added' });
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
        toast({ ...toastSuccess, description: 'Area updated' });
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
      toast({ ...toastSuccess, description: 'Area deleted' });
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
      flexShrink={0}
      h="73px"
      key={businessUnit._id}
      mb="1px"
      p={4}
      w="full"
    >
      <Flex
        cursor="pointer"
        flexDir="column"
        mr={4}
        onClick={() => openBusinessUnitModal('edit', businessUnit)}
        pl={1}
        w={['80%', '30%']}
      >
        <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
          {businessUnit.name}
        </Text>
      </Flex>
      {device !== 'mobile' && (
        <>
          <Box w="calc(70% / 2)">{businessUnit?.owner?.displayName}</Box>
        </>
      )}
      <Flex align="center" w={['20%', 'calc(70% / 2)']}>
        <Text>{businessUnit.complianceItemsResponsesCount || 0}</Text>
        <Tooltip fontSize="md" label="Show Items">
          <ArrowCount
            cursor="pointer"
            h="10px"
            ml="13px"
            onClick={() => {
              history.push({
                pathname: '/',
                state: { businessUnitsIds: [businessUnit._id] },
              });
            }}
            stroke="#282F36"
            w="10px"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );

  return (
    <>
      <AdminModal
        collection="areas"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
      >
        <Stack
          spacing={2}
          w={device === 'mobile' ? 'full' : 'calc(100% - 150px)'}
        >
          <TextInput
            control={control}
            label="Name"
            name="name"
            placeholder="Name"
            validations={{
              notEmpty: true,
            }}
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
        </Stack>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Areas']} mobileBreadcrumbs={['Areas']} />
      <Flex h="calc(100vh - 160px)" overflow="auto" px={['25px', 0]}>
        <Box
          h={['calc(100% - 90px)', 'calc(100% - 35px)']}
          p={[0, '0 25px 30px 30px']}
          w="full"
        >
          <AdminTableHeader>
            <AdminTableHeaderElement
              label="Area name"
              onClick={() => {
                setSortType('name');
                setSortOrder(!sortOrder);
              }}
              showSortingIcon={sortType === 'name'}
              sortOrder={sortType === 'name' && !sortOrder}
              w={['80%', '30%']}
            />
            {device !== 'mobile' && (
              <AdminTableHeaderElement
                label="Owner"
                onClick={() => {
                  setSortType('owner');
                  setSortOrder(!sortOrder);
                }}
                showSortingIcon={sortType === 'owner'}
                sortOrder={sortType === 'owner' && !sortOrder}
                w="calc(70% / 2)"
              />
            )}
            <AdminTableHeaderElement
              label="# of responses"
              onClick={() => {
                setSortType('complianceItemsResponsesCount');
                setSortOrder(!sortOrder);
              }}
              showSortingIcon={sortType === 'complianceItemsResponsesCount'}
              sortOrder={
                sortType === 'complianceItemsResponsesCount' && !sortOrder
              }
              w={['20%', 'calc(70% / 2)']}
            />
          </AdminTableHeader>
          <Flex
            bg="white"
            borderBottomRadius="20px"
            flexDir="column"
            fontSize="smm"
            h="full"
            overflow="auto"
            w="full"
          >
            {loading ? (
              <Loader center />
            ) : businessUnits?.length > 0 ? (
              businessUnits?.map(renderBusinessUnitRow)
            ) : (
              <Flex
                fontSize="18px"
                fontStyle="italic"
                h="full"
                justify="center"
                mt={4}
                w="full"
              >
                No areas found
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Areas;
