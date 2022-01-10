import { Box, Flex, Stack, Spacer, useToast } from "@chakra-ui/react";
import { AdminContext } from "../../contexts/AdminProvider";
import { ILocation } from "../../interfaces/ILocation";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useForm } from "react-hook-form";
import { toastFailed, toastSuccess } from "../../bootstrap/config";
import AdminModal from "../../components/Admin/AdminModal";
import AdminTableHeader from "../../components/Admin/AdminTableHeader";
import AdminTableHeaderElement from "../../components/Admin/AdminTableHeaderElement";
import Header from "../../components/Header";
import Loader from "../../components/Loader";
import PeoplePicker from "../../components/Forms/PeoplePicker";
import TextInput from "../../components/Forms/TextInput";
import TextInputMultiline from "../../components/Forms/TextInputMultiline";
import useDevice from "../../hooks/useDevice";
import LocationListItem from "../../components/LocationListItem";

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
  name: "",
  ownerId: "",
  notes: "",
};

const Locations = () => {
  const toast = useToast();
  const { adminModalState, setAdminModalState } = useContext(AdminContext);
  const { data, loading, refetch } = useQuery(GET_LOCATIONS);
  const [createFunction] = useMutation(CREATE_LOCATION);
  const [updateFunction] = useMutation(UPDATE_LOCATION);
  const [deleteFunction] = useMutation(DELETE_LOCATION);
  const device = useDevice();
  const [locations, setLocations] = useState<ILocation[]>([]);

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

  useEffect(() => {
    if (data?.locations) {
      setLocations(
        [...data.locations].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setLocations([]);
    }
  }, [data]);

  // Reset the form after closing
  useEffect(() => {
    if (adminModalState === "closed") {
      reset(defaultValues);
    }
  }, [reset, adminModalState]);

  // If modal opened in edit or delete mode, reset the form and set values of edited element
  const openLocationModal = (
    action: "edit" | "delete",
    location: ILocation
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
        toast({ ...toastSuccess, description: "Location added" });
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

  const handleUpdateLocation = async () => {
    try {
      if (Object.keys(errors).length === 0) {
        const values = getValues();
        await updateFunction({ variables: { values } });
        toast({ ...toastSuccess, description: "Location updated" });
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

  const handleDeleteLocation = async () => {
    try {
      const { _id } = getValues();
      await deleteFunction({ variables: { _id } });
      toast({ ...toastSuccess, description: "Location deleted" });
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
        handleAddLocation();
        break;
      case "edit":
        handleUpdateLocation();
        break;
      case "delete":
        handleDeleteLocation();
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
        collection={"location"}
      >
        <Flex align="flex-start" direction="column" w={["full", "70%"]}>
          <TextInput
            name="name"
            label="Location name"
            placeholder="e.g. London"
            control={control}
            validations={{
              notEmpty: true,
            }}
          />
          <TextInputMultiline
            name="notes"
            label="Notes"
            placeholder="Add your notes here"
            control={control}
          />
          <PeoplePicker
            control={control}
            name="ownerId"
            label="Owner"
            placeholder="Select"
            validations={{
              notEmpty: true,
            }}
          />
        </Flex>
      </AdminModal>
      <Header breadcrumbs={["Admin", "Locations"]} />
      <Box p={["0", "0 25px 30px 30px"]} h="calc(100vh - 160px)">
        <Flex h="full" px={["25px", 0]}>
          <Box
            w={["full", "full", "calc(100%)"]}
            h={["calc(100% - 170px)", "calc(100% - 35px)"]}
            mr={[0, 0, "50px"]}
          >
            <AdminTableHeader>
              <AdminTableHeaderElement
                w={["max-content", "50%"]}
                label="Location name"
              />
              {device !== "mobile" && device !== "tablet" && (
                <>
                  <AdminTableHeaderElement w={["100%", "50%"]} label="Notes" />
                  <AdminTableHeaderElement w={["100%", "50%"]} label="Owner" />
                </>
              )}
              <Spacer display={["block", "none"]} />
              <AdminTableHeaderElement
                w={["max-content", "50%"]}
                label="No. of responses"
              />
            </AdminTableHeader>

            {loading ? (
              <Box w="full" h="full" bg="white" borderBottomRadius="10px">
                <Loader center={true} />
              </Box>
            ) : (
              <Stack
                h="full"
                bg="white"
                borderBottomRadius="10px"
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
                  <Flex w="full" h="full" fontSize="18px" fontStyle="italic" justify="center">
                    No locations found
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

export default Locations;

export const locationsStyles = {
  locations: {
    fontColor: "#818197",
    tooltipStroke: "#282F36",
  },
};
