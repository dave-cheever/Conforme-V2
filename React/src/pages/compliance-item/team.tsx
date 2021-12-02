import React, { useEffect, useState } from "react";
import { Box, Flex, Stack, Text, VStack } from "@chakra-ui/layout";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@chakra-ui/modal";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/input";
import { useRadioGroup } from "@chakra-ui/radio";

import AvatarUser from "../../components/Team/AvatarUser";
import CustomRadioButton from "../../components/CustomRadioButton";
import { IUser } from "../../interfaces/IUser";
import Loader from "../../components/Loader";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { SearchIcon } from "../../icons";

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    usersById(userQueryInput: $userQueryInput) {
      _id
      firstName
      lastName
      displayName
      imgUrl
    }
  }
`;

const SEARCH_USERS = gql`
  query ($searchQueryInput: SearchQueryInput) {
    searchUsers(searchQueryInput: $searchQueryInput) {
      _id
      firstName
      lastName
      displayName
    }
  }
`;

const ADD_DELEGATE = gql`
  mutation ($responseDelegateModifyInput: ResponseDelegateModifyInput!) {
    addDelegate(responseDelegateModifyInput: $responseDelegateModifyInput) {
      _id
    }
  }
`;

const Team = () => {
  const { response, refetch: refetchResponse } = useResponseContext();
  const maxDelegates = 2;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userSearchResults, setUserSearchResults] = useState<IUser[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string>("");
  const { data: { usersById: owner } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.businessUnit?.ownerId || [] } } });
  const { data: { usersById: delegates } = [] } = useQuery(GET_USERS_BY_ID, { variables: { userQueryInput: { usersIds: response?.delegateIds || [] } } });
  const { data, loading, refetch: refetchUsers } = useQuery(SEARCH_USERS, { variables: { searchQueryInput: { searchText: searchQuery } } });
  const [addDelegate] = useMutation(ADD_DELEGATE);

  useEffect(() => {
    refetchUsers();
    setSelectedRadio("");
    if (data?.searchUsers && searchQuery) {
      const filteredUsers = data.searchUsers.filter(({ _id }) => _id !== response?.businessUnit?.ownerId && !response?.delegateIds.includes(_id));

      setUserSearchResults(filteredUsers);
    } else {
      setUserSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, data])
  ;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "delegates",
    value: selectedRadio,
    onChange: setSelectedRadio
  });

  const group = getRootProps();
  
  const responseOwner: IUser = owner && owner?.length !== 0 && owner[0];

  const handleClose = () => {
    onClose();
    setSelectedRadio("");
    setSearchQuery("");
  }
  
  return (
    <Stack
      h="calc(100% - 25px)"
      w="calc(100% - 400px)"
      spacing="40px"
      p="25px 30px"
      bg="teamPage.bg"
      rounded="20px"
      fontSize="smm"
      fontWeight="bold"
    >
      <Modal variant="teamModal" isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalContent>
          <ModalHeader>
            <Text>Add delegate</Text>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <InputGroup>
              <InputLeftElement
                zIndex={50}
                children={<SearchIcon fill="teamPage.modal.searchIcon"/>}
              />
              <Input
                borderWidth='1px'
                borderColor='teamPage.modal.inputBorder'
                h='40px'
                mb={0}
                zIndex={2}
                fontSize="smm"
                value={searchQuery}
                rounded="10px"
                onChange={({ target: { value } }) => {
                  setSearchQuery(value)
                }}
              />
            </InputGroup>
            <Flex maxH="158px" mt="20px" direction='column'>
              {loading 
                ? <Flex w='full' h='50px' px={3} fontStyle='italic' align='center'>
                    <Box w='40px' mr={3}>
                      <Loader size='md' />
                    </Box>
                    Searching...
                  </Flex> 
                : userSearchResults.length > 0 
                  ? <VStack h="full" {...group} alignItems="flex-start" mb="20px" overflow="auto" spacing="20px ">
                      {userSearchResults.map((user) => {
                        const radio = getRadioProps({ value: user._id });
                        return (
                          <CustomRadioButton key={user._id} {...radio}>
                            <Text fontSize="smm" fontWeight="semi_medium" color="teamPage.radioButtonFont" >
                              {user.firstName && user.lastName ?  `${user.firstName} ${user.lastName}` : `${user.displayName}`}
                            </Text>
                          </CustomRadioButton>
                        )
                      })}
                    </VStack>
                  : searchQuery && <Flex align='center' fontStyle='italic' pl={5} maxWidth='400px' h='50px'>No results found</Flex>}
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
              _hover={{bg: "teamPage.button.add.bg"}}
              onClick={async () => {
                await addDelegate({ variables: { responseDelegateModifyInput: { _id: response?._id, delegateId: selectedRadio } }});
                refetchResponse();
                handleClose();
              }}
            >
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {owner && <Flex>
        <Flex flexDir="column">
          <Text mb="15px">Owner</Text>
          <Flex>
            <AvatarUser user={responseOwner} />
          </Flex>
        </Flex>
      </Flex>}
      <Flex>
        <Flex flexDir="column">
          <Flex alignItems="center" mb="15px">
            <Text>Delegates</Text>
            {response?.delegateIds?.length! < maxDelegates && 
              <Button 
                w="52px" 
                h="28px" 
                ml="10px" 
                bg="teamPage.button.addDelegates.bg" 
                fontSize="11px" 
                color="teamPage.button.addDelegates.color" 
                rounded="10px" 
                onClick={() => onOpen()}
              >
                Add
              </Button>
            }
          </Flex>
          <Flex>
            {delegates?.map(delegate => 
              <AvatarUser key={delegate._id} user={delegate} removable={true}/>
            )}
            </Flex>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default Team;

export const teamPageStyles = {
  teamPage: {
    bg: "#FFFFFF",
    modal: {
      searchIcon: "#434B4F",
      inputBorder: "#cdcdd5"
    },
    radioButtonFont: "#818197",
    button: {
      add: {
        bg: "#462AC4",
        color: "#FFFFFF",
      },
      addDelegates: {
        bg: "#818197",
        color: "#FFFFFF"
      } 
    }
  }
};
