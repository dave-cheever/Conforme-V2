import React, { useCallback, useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import { SearchIcon } from '@chakra-ui/icons';
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
} from '@chakra-ui/react';
import { debounce } from 'lodash';

import { toastFailed } from '../../bootstrap/config';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { useTeamContext } from '../../contexts/TeamProvider';
import { TickIcon } from '../../icons';
import { responsePermissionByFilterType } from '../../utils/helpers';
import Loader from '../Loader';

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
  const [searchText, setSearchText] = useState<string>('');

  const handleClose = () => {
    onClose();
    setSelectedParticipants([]);
    setSearchText('');
    setSearchQuery('');
    setIsReplaceAccountable(false);
  };

  const handleAddParticipant = async () => {
    try {
      await addParticipant({
        variables: {
          responseParticipantModify: {
            _id: response?._id,
            participantIds: selectedParticipants.map(
              (participant) => participant._id,
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
        title: 'Error',
        description: error.message,
      });
    }
  };

  // debounce query to make less request on server.

  const setDelayQuery = useCallback(
    debounce((q) => {
      setSearchQuery(q);
    }, 1000),
    [],
  );

  const onQueryChanged = (query: string) => {
    setSearchText(query);
    setDelayQuery(query);
  };

  const isSelected = (userId: string) => {
    if (selectedParticipants.length === 0) return false;

    return (
      selectedParticipants.filter((participant) => participant._id === userId)
        ?.length > 0
    );
  };

  const handleSelectParticipant = (user) => {
    if (!isSelected(user._id)) {
      if (filterType === 'contributorsIds' || filterType === 'followersIds')
        return setSelectedParticipants([...selectedParticipants, user]);

      setSelectedParticipants([user]);
    } else {
      if (filterType === 'contributorsIds' || filterType === 'followersIds') {
        return setSelectedParticipants([
          ...selectedParticipants.filter(
            (participant) => participant._id !== user._id,
          ),
        ]);
      }
      setSelectedParticipants([]);
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose} variant="teamModal">
      <ModalContent>
        <ModalHeader>
          <Text>
            {isReplaceAccountable
              ? 'Replace'
              : !isReplaceAccountable && filterType === 'accountableId'
              ? 'Select'
              : `Add ${responsePermissionByFilterType(filterType)}s`}
          </Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement zIndex={50}>
              <SearchIcon fill="teamPage.modal.searchIcon" />
            </InputLeftElement>
            <Input
              autoFocus
              borderColor="teamPage.modal.inputBorder"
              borderWidth="1px"
              fontSize="smm"
              h="40px"
              mb={0}
              onChange={({ target: { value } }) => {
                onQueryChanged(value);
              }}
              rounded="10px"
              value={searchText}
              zIndex={2}
            />
          </InputGroup>
          <Flex>
            {(filterType === 'contributorsIds' ||
              filterType === 'followersIds') && (
              <Text
                color="teamPage.radioButtonFont"
                fontSize="smm"
                fontWeight="semi_medium"
                ml="2"
                mt={2}
              >
                {selectedParticipants.length} users selected
              </Text>
            )}
          </Flex>
          <Flex direction="column" maxH="258px" mt="20px">
            {loading ? (
              <Flex align="center" fontStyle="italic" h="50px" px={3} w="full">
                <Box mr={3} w="40px">
                  <Loader size="md" />
                </Box>
                Searching...
              </Flex>
            ) : userSearchResults.length > 0 ? (
              <VStack
                alignItems="flex-start"
                h="full"
                mb="20px"
                overflow="auto"
                spacing="10px"
              >
                {userSearchResults.map((user) => (
                  <Flex align="center" key={user._id}>
                    {/* added this instead of checkbox, because of console error on checkbox */}
                    <Flex
                      align="center"
                      bg={
                        isSelected(user._id)
                          ? 'teamPage.button.add.bg'
                          : 'white'
                      }
                      borderColor="#81819750"
                      borderRadius="full"
                      borderWidth="1px"
                      cursor="pointer"
                      h="20px"
                      justify="center"
                      onClick={() => handleSelectParticipant(user)}
                      pt="1"
                      w="20px"
                    >
                      <TickIcon h="10px" stroke="white" w="10px" />
                    </Flex>
                    <Flex direction="column" ml="2">
                      <Text
                        color="black"
                        fontSize="smm"
                        fontWeight="semibold"
                      >
                        {user.displayName}
                      </Text>
                      <Box
                        fontSize="sm"
                        overflow="hidden"
                        position="relative"
                        textOverflow="ellipsis"
                        top="-4px"
                        w="290px"
                      >
                        {user.email}
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </VStack>
            ) : (
              searchQuery && (
                <Flex
                  align="center"
                  fontStyle="italic"
                  h="50px"
                  maxWidth="400px"
                  pl={5}
                >
                  No results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter pt="0px">
          <Button
            _hover={{ bg: 'teamPage.button.add.bg' }}
            bg="teamPage.button.add.bg"
            color="teamPage.button.add.color"
            fontSize="smm"
            fontWeight="bold"
            h="38px"
            mb="6px"
            mr="1px"
            onClick={handleAddParticipant}
            w="68px"
          >
            {isReplaceAccountable
              ? 'Replace'
              : !isReplaceAccountable && filterType === 'accountableId'
              ? 'Select'
              : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamModal;
