import { Box, Flex, Stack, useToast } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";

import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import AdminTableRow from "../../components/Admin/AdminTableRow";
import { IBaseWithName } from "../../interfaces/IBaseWithName";
import { AdminContext } from "../../contexts/AdminProvider";
import TextInput from "../../components/Forms/TextInput";
import Loader from "../../components/Loader";
import Header from "../../components/Header";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import BarChart from "../../components/BarChart";
import useDevice from "../../hooks/useDevice";

const GET_CATEGORIES = gql`
  query {
    categories {
      _id
      name
      complianceItemsResponsesCount
    }
  }
`;
const CREATE_CATEGORY = gql`
  mutation ($name: String!) {
    createCategory(name: $name) {
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
  _id: "",
  name: "",
};

const Categories = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_CATEGORIES);
  const [createFunction] = useMutation(CREATE_CATEGORY);
  const [updateFunction] = useMutation(UPDATE_CATEGORY);
  const [deleteFunction] = useMutation(DELETE_CATEGORY);
  const device = useDevice();
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState(true);
  
  const getCategories = (categoriesArray: IBaseWithName[]) => {
    if (!categoriesArray) {
      return [];
    }
    return [...categoriesArray].sort((a, b) => a.name.localeCompare(b.name));
  }
  const [categories, setCategories] = useState<IBaseWithName[]>(getCategories(data?.categories));

  useEffect(() => {
    setCategories(getCategories(data?.categories));
  }, [data]);

  useEffect(() => {
    if (sortOrder) {
      setCategories([...categories].sort((a, b) => {
        return (a[sortType] || 0).toString().localeCompare((b[sortType] || 0).toString())
      }));
    }
    else {
      setCategories([...categories].sort((a, b) => {
        return (b[sortType] || 0).toString().localeCompare((a[sortType] || 0).toString())
      }));
    }
  }, [sortType, sortOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openCategoryModal = (
    action: "edit" | "delete",
    category: IBaseWithName
  ) => {
    setAdminModalState(action);
    reset({
      _id: category._id,
      name: category.name,
    });
  };

  const handleAddCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await createFunction({ variables: values });
        toast({ ...toastSuccess, description: "Category added" });
        refetch();
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleUpdateCategory = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: "Category updated" });
        refetch();
      } else {
        toast({
          ...toastFailed,
          description: "Please complete all the required fields",
        });
      }
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: "Category deleted" });
      refetch();
    } catch (e: any) {
      toast({ ...toastFailed, description: e.message });
    } finally {
      setAdminModalState("closed");
    }
  };

  const handleAction = async (action) => {
    const isFormValid = await trigger();
    if (["add", "edit"].includes(action) && !isFormValid) {
      return toast({
        ...toastFailed,
        description: "Please complete all the required fields",
      });
    }
    switch (action) {
      case "add":
        handleAddCategory();
        break;
      case "edit":
        handleUpdateCategory();
        break;
      case "delete":
        handleDeleteCategory();
        break;
      default:
        setAdminModalState("closed");
    }
  };

  return (
    <>
      <AdminModal
        isOpenModal={adminModalState !== "closed"}
        modalType={adminModalState}
        onAction={handleAction}
        collection={"category"}
      >
        <Flex w="full" align="flex-start" direction="column">
          <TextInput
            name="name"
            label="Name"
            placeholder="Category name"
            control={control}
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Categories"]} mobileBreadcrumbs={["Categories"]} />
      <Box p={["0", "0 25px 30px 30px"]} h="calc(100vh - 160px)" overflow="auto">
        <Flex h="full" px={["25px", 0]}>
          <Box w={["full", "full", "calc(100% - 250px)"]} h={['calc(100% - 90px)', 'calc(100% - 35px)']} mr={[0, 0, "50px"]}>
            <AdminTableHeader>
              <AdminTableHeaderElement w={["80%", "50%"]} label="Category" onClick={() => { setSortType("name"); setSortOrder(!sortOrder); }} sortOrder={sortType === "name" && !sortOrder} showSortingIcon={sortType === "name"} />
              <AdminTableHeaderElement w={["20%", "50%"]} label="Responses count" onClick={() => { setSortType("complianceItemsResponsesCount"); setSortOrder(!sortOrder); }} sortOrder={sortType === "complianceItemsResponsesCount" && !sortOrder} showSortingIcon={sortType === "complianceItemsResponsesCount"} />
            </AdminTableHeader>
            <Stack
              h={loading ? "full": "fit-content"}
              bg="white"
              borderBottomRadius="20px"
              spacing="1px"
              pb="3"
              minH="full"
            >
              {loading ? <Loader center={true} /> : categories?.length > 0 ? (
                categories?.map((category, i) => (
                  <AdminTableRow
                    key={category._id}
                    element={category}
                    index={i}
                    edit={() => openCategoryModal("edit", category)}
                  />
                ))
              ) : (
                <Flex w="full" h="full" mt={4} fontSize="18px" fontStyle="italic" justify="center">
                  No categories found
                </Flex>
              )}
            </Stack>
          </Box>
          {device === "desktop" &&
            <Flex
              flexDirection="column"
              alignItems="center"
              w={["100%", "220px"]}
            >
              <Box w="100%">
                {categories && <BarChart
                  data={categories.map(({ _id, complianceItemsResponsesCount }) => ({ _id, count: complianceItemsResponsesCount }))}
                  label="Categories"
                />}
              </Box>
            </Flex>
          }
        </Flex>
      </Box>
    </>
  );
};

export default Categories;

export const categoriesStyles = {
  categories: {
    fontColor: "#818197",
  }
};
