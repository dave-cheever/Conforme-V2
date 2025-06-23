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

  return (
    <>
      <AdminModal
        collection="category"
        data-id="01c5bc371383"
        isOpenModal={adminModalState !== 'closed'}
        modalType={adminModalState}
        onAction={handleAction}
        onAddMore={adminModalState === 'add' ? handleAddAndResetCategory : undefined}
      >
        <Flex align="flex-start" data-id="b1f73fb84928" direction="column" w="full">
          <TextInput
            control={control}
            data-id="19ea0a600288"
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
      <Header
        breadcrumbs={['Admin', 'Categories']}
        data-id="785ad45decb2" mobileBreadcrumbs={['Categories']} pageLabel="Category" />
      <Box data-id="f13ecd68fd5e" h="calc(100vh - 160px)" overflow="auto" p={['0', '0 25px 30px 30px']}>
        <Flex data-id="de7dc4ff2c7a" h="full" px={['25px', 0]}>
          <Box     
            border="1px solid #E2E8F0"
            data-id="68abdc5bbebd"
            h="fit-content"
            // h={['calc(100% - 160px)', 'calc(100% - 35px)']}
            mr={[0, 0, module?.type === 'tracker' ? '50px' : 0]}
            w={['full', 'full', module?.type === 'tracker' ? 'calc(100% - 250px)' : 'full']}
          >
            <AdminTableHeader data-id="9a8f6d144d9b">
              <AdminTableHeaderElement
                data-id="6388e10281f4"
                label="Category"
                onClick={() => {
                  setSortType('name');
                  setSortOrder(sortOrder === 'asc' && sortType === 'name' ? 'desc' : 'asc');
                }}
                showSortingIcon={sortType === 'name'}
                sortOrder={sortType === 'name' ? sortOrder : undefined}
                w={['80%', '50%']}
              />
              {module?.type === 'tracker' && (
                <AdminTableHeaderElement
                  data-id="c6c0c6c62853"
                  label="Responses count"
                  onClick={() => {
                    setSortType('trackerItemsResponsesCount');
                    setSortOrder(sortOrder === 'asc' && sortType === 'trackerItemsResponsesCount' ? 'desc' : 'asc');
                  }}
                  showSortingIcon={sortType === 'trackerItemsResponsesCount'}
                  sortOrder={sortType === 'trackerItemsResponsesCount' ? sortOrder : undefined}
                  tooltip="Only published items"
                  w={['20%', '50%']}
                />
              )}
            </AdminTableHeader>
            <Stack
              bg="white"
              borderBottomRadius="20px"
              data-id="b4ceb0af7426"
              h={loading ? 'full' : 'fit-content'}
              minH="full"
              pb="3"
              spacing="1px"
            >
              {loading ? (
                <Loader center data-id="3f45d2e8a2a1" />
              ) : categories?.length > 0 ? (
                categories?.map((category) => (
                  <AdminTableRow
                    data-id="01df96183ed7"
                    edit={() => openCategoryModal('edit', category)}
                    element={category}
                    key={category._id}
                    responseToEdit="categoriesIds"
                  />
                ))
              ) : (
                <Flex data-id="a8a85eead14f" fontSize="18px" fontStyle="italic" h="full" justify="center" mt={4} w="full">
                  No categories found
                </Flex>
              )}
            </Stack>
          </Box>
          {device === 'desktop' && module?.type === 'tracker' && (
            <Flex alignItems="center" data-id="19cfc9321608" flexDirection="column" w={['100%', '220px']}>
              <Box data-id="a5f894bab33b" w="100%">
                {categories && (
                  <BarChart
                    data={categories.map(({ _id, trackerItemsResponsesCount }) => ({
                      _id,
                      count: trackerItemsResponsesCount,
                    }))}
                    data-id="89aed783124e"
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
