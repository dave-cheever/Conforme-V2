import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { gql, useMutation } from "@apollo/client";
import debounce from "lodash.debounce";

import { responsePermissionByFilterType } from "../../utils/helpers";
import Loader from "../Loader";
import { useTeamContext } from "../../contexts/TeamProvider";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { toastFailed } from "../../bootstrap/config";
import { TickIcon } from "../../icons";

const ADD_PARTICIPANT = gql`
  mutation ($responseParticipantModify: ResponseParticipantModify!) {
    addParticipant(responseParticipantModify: $responseParticipantModify) {
      _id
    }
  }
`;

const TeamModal = () => {
  const toast = useToast();
  const { response, refetch } = useResponseContext();
  const {
    filterType,
    isOpen,
    loading,
    userSearchResults,
    searchQuery,
    onClose,
    setSearchQuery,
    setSelectedParticipants,
    isReplaceAccountable,
    setIsReplaceAccountable,
    selectedParticipants,
  } = useTeamContext();
  const [addParticipant] = useMutation(ADD_PARTICIPANT);
  const [searchText, setSearchText] = useState<string>("");

  const handleClose = () => {
    onClose();
    setSelectedParticipants([]);
    setSearchText("")
    setSearchQuery("");
    setIsReplaceAccountable(false);
  };

  const handleAddParticipant = async () => {
    try {
      await addParticipant({
        variables: {
          responseParticipantModify: {
            _id: response?._id,
            participantIds: selectedParticipants.map(
              (participant) => participant._id
            ),
            permission: responsePermissionByFilterType(filterType),
          },
        },
      });
      refetch();
      handleClose();
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: "Error",
        description: error.message,
      });
    }
  };

  //debounce query to make less request on server.
  // eslint-disable-next-line
  const setDelayQuery = useCallback(
    debounce((q) => {
      setSearchQuery(q);
    }, 1000),
    []
  );

  const onQueryChanged = (query: string) => {
    setSearchText(query);
    setDelayQuery(query);
  };

  const isSelected = (userId: string) => {
    if (selectedParticipants.length === 0) {
      return false;
    }
    return (
      selectedParticipants.filter((participant) => participant._id === userId)
        ?.length > 0
    );
  };

  const handleSelectParticipant = (user) => {
    if (!isSelected(user._id)) {
      if (filterType === "contributorsIds" || filterType === "followersIds") {
        return setSelectedParticipants([...selectedParticipants, user]);
      }
      setSelectedParticipants([user]);
    } else {
      if (filterType === "contributorsIds" || filterType === "followersIds") {
        return setSelectedParticipants([
          ...selectedParticipants.filter(
            (participant) => participant._id !== user._id
          ),
        ]);
      }
      setSelectedParticipants([]);
    }
  };

  return (
    <Modal variant="teamModal" isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalContent>
        <ModalHeader>
          <Text>
            {isReplaceAccountable
              ? "Replace"
              : !isReplaceAccountable && filterType === "accountableId"
                ? "Select"
                : `Add ${responsePermissionByFilterType(filterType)}s`
            }
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement
              zIndex={50}
              children={<SearchIcon fill="teamPage.modal.searchIcon" />}
            />
            <Input
              borderWidth="1px"
              borderColor="teamPage.modal.inputBorder"
              h="40px"
              mb={0}
              zIndex={2}
              fontSize="smm"
              value={searchText}
              rounded="10px"
              autoFocus
              onChange={({ target: { value } }) => {
                onQueryChanged(value);
              }}
            />
          </InputGroup>
          <Flex>
            {(filterType === "contributorsIds" || filterType === "followersIds") && <Text
              ml="2"
              mt={2}
              fontSize="smm"
              fontWeight="semi_medium"
              color="teamPage.radioButtonFont"
            >{selectedParticipants.length} users selected</Text>}
          </Flex>
          <Flex maxH="258px" mt="20px" direction="column">
            {loading ? (
              <Flex w="full" h="50px" px={3} fontStyle="italic" align="center">
                <Box w="40px" mr={3}>
                  <Loader size="md" />
                </Box>
                Searching...
              </Flex>
            ) : userSearchResults.length > 0 ? (
              <VStack
                h="full"
                alignItems="flex-start"
                mb="20px"
                overflow="auto"
                spacing="10px"
              >
                {userSearchResults.map((user) => (
                  <Flex key={user._id} align="center">
                    {/* added this instead of checkbox, because of console error on checkbox */}
                    <Flex
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      borderWidth="1px"
                      borderColor="#81819750"
                      cursor="pointer"
                      onClick={() => handleSelectParticipant(user)}
                      bg={
                        isSelected(user._id)
                          ? "teamPage.button.add.bg"
                          : "white"
                      }
                      pt="1"
                      align="center"
                      justify="center"
                    >
                      <TickIcon w="10px" h="10px" stroke="white" />
                    </Flex>
                    <Flex ml="2" direction='column' >
                      <Text
                        fontSize="smm"
                        fontWeight='semibold'
                        color="black"
                        direction='column'
                      >
                        {user.displayName}
                      </Text>
                      <Box w='290px' overflow='hidden' textOverflow='ellipsis' position='relative' top='-4px' fontSize='sm'>{user.email}</Box>
                    </Flex>
                  </Flex>
                ))}
              </VStack>
            ) : (
              searchQuery && (
                <Flex
                  align="center"
                  fontStyle="italic"
                  pl={5}
                  maxWidth="400px"
                  h="50px"
                >
                  No results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter pt="0px">
          <Button
            w="68px"
            h="38px"
            mr="1px"
            mb="6px"
            bg="teamPage.button.add.bg"
            color="teamPage.button.add.color"
            fontSize="smm"
            fontWeight="bold"
            _hover={{ bg: "teamPage.button.add.bg" }}
            onClick={handleAddParticipant}
          >
            {isReplaceAccountable
              ? "Replace"
              : !isReplaceAccountable && filterType === "accountableId"
                ? "Select"
                : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamModal;
