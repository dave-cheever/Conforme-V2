import React from 'react';
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
  useRadioGroup,
  useToast,
  VStack
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { gql, useMutation } from '@apollo/client';

import { responsePermissionByFilterType } from '../../utils/helpers';
import CustomRadioButton from '../CustomRadioButton';
import Loader from '../Loader';
import { useTeamContext } from '../../contexts/TeamProvider';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { toastFailed } from "../../bootstrap/config";

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
  const { filterType, isOpen, loading, userSearchResults, selectedRadio, searchQuery, onClose, setSearchQuery, setSelectedRadio, isReplaceAccountable, setIsReplaceAccountable } = useTeamContext();
  const [addParticipant] = useMutation(ADD_PARTICIPANT);

  const handleClose = () => {
    onClose();
    setSelectedRadio("");
    setSearchQuery("");
    setIsReplaceAccountable(false)
  };

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "participants",
    value: selectedRadio,
    onChange: setSelectedRadio
  });

  const group = getRootProps();

  const handleAddParticipant = async () => {
    try {
      await addParticipant({
        variables: {
          responseParticipantModify: {
            _id: response?._id,
            participantIds: [selectedRadio],
            permission: responsePermissionByFilterType(filterType)
          }
        }
      });
      refetch();
      handleClose();
    } catch (error: any) {
      toast({
        ...toastFailed,
        title: 'Error',
        description: error.message
      });
    }
  }

  return (
    <Modal variant="teamModal" isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalContent>
        <ModalHeader>
          <Text>{isReplaceAccountable ? "Replace" : (!isReplaceAccountable && filterType === "accountableId") ? "Select" : "Add"} {responsePermissionByFilterType(filterType)}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement
              zIndex={50}
              children={<SearchIcon fill="teamPage.modal.searchIcon" />}
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
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : `${user.displayName}`}
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
            bg={isReplaceAccountable ? "teamPage.button.replace.bg" : "teamPage.button.add.bg"}
            color={isReplaceAccountable ? "teamPage.button.replace.color" : "teamPage.button.add.color"}
            fontSize="smm"
            fontWeight="bold"
            _hover={{ bg: isReplaceAccountable ? "teamPage.button.replace.bg" : "teamPage.button.add.bg" }}
            onClick={handleAddParticipant}
          >
            {isReplaceAccountable ? "Replace" : (!isReplaceAccountable && filterType === "accountableId") ? "Select" : "Add"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TeamModal;
