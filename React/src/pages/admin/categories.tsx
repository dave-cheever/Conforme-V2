import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Flex, useToast } from '@chakra-ui/react';

import { toastFailed, toastSuccess } from '../../bootstrap/config';
import AdminModal from '../../components/Admin/AdminModal';
import BarChart from '../../components/BarChart';
import TextInput from '../../components/Forms/TextInput';
import Header from '../../components/Header';
import Loader from '../../components/Loader';
import TextOrNumberCell from '../../components/Table/Cells/TextOrNumberCell';
import ListView, { ColumnConfig } from '../../components/Table/ListView';
import { AdminContext } from '../../contexts/AdminProvider';
import { useAppContext } from '../../contexts/AppProvider';
import useDevice from '../../hooks/useDevice';
import { IBaseWithName } from '../../interfaces/IBaseWithName';

const GET_CATEGORIES = gql`
  query ($moduleId: ID!) {
    categories(moduleId: $moduleId) {
      _id
      name
      trackerItemsResponsesCount
    }
  }
`;
const CREATE_CATEGORY = gql`
  mutation ($name: String!, $moduleId: ID!) {
    createCategory(name: $name, moduleId: $moduleId) {
      _id
      name
    }
  }
`;
const UPDATE_CATEGORY = gql`
  mutation ($values: BaseWithNameModifyInput!) {
    updateCategory(categoryInput: $values) {
      _id
      name
    }
  }
`;
const DELETE_CATEGORY = gql`
  mutation ($_id: String!) {
    deleteCategory(_id: $_id)
  }
`;

const defaultValues = {
  _id: '',
  name: '',
};

function Categories() {
  const toast = useToast();
  const { module } = useAppContext();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_CATEGORIES, { variables: { moduleId: module?._id }, skip: !module?._id });
  const [createFunction] = useMutation(CREATE_CATEGORY);
  const [updateFunction] = useMutation(UPDATE_CATEGORY);
  const [deleteFunction] = useMutation(DELETE_CATEGORY);
  const device = useDevice();
  const [sortType, setSortType] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentCategoryName, setCurrentCategoryName] = useState('');

  const getCategories = (categoriesArray: IBaseWithName[]) => {
    if (!categoriesArray) return [];

    return [...categoriesArray].sort((a, b) => a.name.localeCompare(b.name));
  };
  const [categories, setCategories] = useState<IBaseWithName[]>(getCategories(data?.categories));

  useEffect(() => {
    setCategories(getCategories(data?.categories));
  }, [data]);

  useEffect(() => {
    setCategories((prevCategories) =>
      [...prevCategories].sort((a, b) => {
        const valueA = (a[sortType] || '').toString().toLowerCase();
        const valueB = (b[sortType] || '').toString().toLowerCase();
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }),
    );
  }, [sortType, sortOrder]);

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
      setCurrentCategoryName('');
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openCategoryModal = (action: 'edit' | 'delete', category: IBaseWithName) => {
    setAdminModalState(action);
    setCurrentCategoryName(category.name);
    reset({
      _id: category._id,
      name: category.name,
    });
  };

  const handleAddCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: { ...values, moduleId: module?._id } });
        toast({ ...toastSuccess, description: 'Category added' });
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

  const handleUpdateCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: 'Category updated' });
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

  const handleDeleteCategory = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: 'Category deleted' });
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
        handleAddCategory();
        break;
      case 'edit':
        handleUpdateCategory();
        break;
      case 'delete':
        handleDeleteCategory();
        break;
      default:
        setAdminModalState('closed');
    }
  };

  const handleAddAndResetCategory = async () => {
    try {
      const isValid = await trigger();
      if (!isValid) {
        return toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }

      const values = getValues();
      await createFunction({ variables: { ...values, moduleId: module?._id } });
      toast({ ...toastSuccess, description: 'Category added' });

      reset(defaultValues);
      setCurrentCategoryName('');
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    }
  };

  const columns: ColumnConfig[] = [
    {
      label: 'Category',
      sortKey: 'name',
      width: module?.type === 'tracker' ? '70%' : '100%',
      dataId: '000346',
      render: (category: IBaseWithName) => (
        <Flex
          color="auditsList.fontColor"
          data-id="001927"
          fontSize="14px"
          fontWeight="500"
          lineHeight="18px"
          noOfLines={1}
          textOverflow="ellipsis"
        >
          {category.name}
        </Flex>
      ),
    },
    ...(module?.type === 'tracker'
      ? [
          {
            label: 'Responses count',
            sortKey: 'trackerItemsResponsesCount',
            width: '30%',
            dataId: '000347',
            tooltip: 'Only published items',
            render: (category: IBaseWithName & { trackerItemsResponsesCount: number }) => (
              <TextOrNumberCell data-id="002092" text={category.trackerItemsResponsesCount || 0} />
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      <AdminModal
        collection="category"
        data-id="000338"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetCategory : undefined}
      >
        <Flex align="flex-start" data-id="000339" direction="column" w="full">
          <TextInput
            control={control}
            data-id="000340"
            initialValue={currentCategoryName.toLowerCase()}
            label="Name"
            name="name"
            placeholder="Category name"
            required
            validations={{
              notEmpty: true,
              uniqueValue: categories.map(({ name }) => name.toLowerCase()),
            }}
          />
        </Flex>
      </AdminModal>
      <Header breadcrumbs={['Admin', 'Categories']} data-id="000341" mobileBreadcrumbs={['Categories']} pageLabel="Category" />
      <Box bg="auditsList.bg" data-id="000342" h="full" overflow="hidden">
        <Flex data-id="000343" h="full" px={['25px', 0]}>
          {loading ? (
            <Box bg="white" borderBottomRadius="10px" data-id="000349" h="full" w="full">
              <Loader center data-id="000350" />
            </Box>
          ) : (
            <ListView
              columns={columns}
              data={categories}
              data-id="000344"
              dataType="categories"
              onRowClick={(row: IBaseWithName) => openCategoryModal('edit', row)}
              setSortOrder={setSortOrder}
              setSortType={setSortType}
              sortOrder={sortOrder}
              sortType={sortType}
            />
          )}
          {device === 'desktop' && module?.type === 'tracker' && (
            <Flex alignItems="center" data-id="000352" flexDirection="column" w={['100%', '220px']}>
              <Box data-id="000353" w="100%">
                {categories && (
                  <BarChart
                    data={categories.map(({ _id, trackerItemsResponsesCount }) => ({
                      _id,
                      count: trackerItemsResponsesCount,
                    }))}
                    data-id="000354"
                    label="Categories"
                  />
                )}
              </Box>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}

export default Categories;

export const categoriesStyles = {
  categories: {
    fontColor: '#818197',
  },
};
