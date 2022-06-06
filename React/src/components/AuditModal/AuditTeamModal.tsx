import { useCallback, useState } from 'react';

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
  VStack,
} from '@chakra-ui/react';
import { debounce } from 'lodash';

import { useAuditTeamContext } from '../../contexts/AuditTeamProvider';
import { TickIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import Loader from '../Loader';

type AuditModalProps = {
  isOpen: boolean;
  multiple: boolean;
  onClose: () => void;
  onCancel: () => void;
};

const AuditTeamModal = ({ isOpen, multiple, onCancel, onClose }: AuditModalProps) => {
  const { loading, data, searchQuery, setSearchQuery, selectedAuditor, setSelectedAuditor, selectedParticipants, setSelectedParticipants } =
    useAuditTeamContext();
  const [searchText, setSearchText] = useState<string>('');

  const handleClose = () => {
    setSearchText('');
    setSearchQuery('');
    onCancel();
  };

  const handleSelectUser = (user: IUser) => {
    if (multiple) {
      if (selectedParticipants.find((participant) => (participant as IUser)?._id === user._id))
        setSelectedParticipants([...selectedParticipants.filter((participant) => (participant as IUser)?._id !== user._id)]);
      else setSelectedParticipants([...selectedParticipants, user as IUser]);
    } else setSelectedAuditor(user);
  };

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
    if (multiple) return selectedParticipants.filter((user) => user?._id === userId)?.length > 0;

    return selectedAuditor._id === userId;
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={handleClose}>
      <ModalContent>
        <ModalHeader>
          <Text>{multiple ? 'Select Participants' : 'Select Auditor'}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement zIndex={50}>
              <SearchIcon fill="auditTeamModal.modal.searchIcon" />
            </InputLeftElement>
            <Input
              autoFocus
              borderColor="auditTeamModal.modal.inputBorder"
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
            {multiple && (
              <Text color="auditTeamModal.radioButtonFont" fontSize="smm" fontWeight="semi_medium" ml="2" mt={2}>
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
            ) : data?.searchUsers.length > 0 ? (
              <VStack alignItems="flex-start" h="full" mb="20px" overflow="auto" spacing="10px">
                {data?.searchUsers.map((user) => (
                  <Flex align="center" key={user._id}>
                    {/* added this instead of checkbox, because of console error on checkbox */}
                    <Flex
                      align="center"
                      bg={isSelected(user._id) ? 'auditTeamModal.button.add.bg' : 'white'}
                      borderColor="#81819750"
                      borderRadius="full"
                      borderWidth="1px"
                      cursor="pointer"
                      h="20px"
                      justify="center"
                      onClick={() => handleSelectUser(user)}
                      pt="1"
                      w="20px"
                    >
                      <TickIcon h="10px" stroke="white" w="10px" />
                    </Flex>
                    <Flex direction="column" ml="2">
                      <Text color="black" fontSize="smm" fontWeight="semibold">
                        {user.displayName} - {user.jobTitle || 'No job title'}
                      </Text>
                      <Box fontSize="sm" overflow="hidden" position="relative" textOverflow="ellipsis" top="-4px" w="290px">
                        {user.email}
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </VStack>
            ) : (
              searchQuery && (
                <Flex align="center" fontStyle="italic" h="50px" maxWidth="400px" pl={5}>
                  No results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter pt="0px">
          <Button
            _hover={{ bg: 'auditTeamModal.button.add.bg' }}
            bg="auditTeamModal.button.add.bg"
            color="auditTeamModal.button.add.color"
            fontSize="smm"
            fontWeight="bold"
            h="38px"
            mb="6px"
            mr="1px"
            onClick={onClose}
            w="68px"
          >
            Select
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AuditTeamModal;

export const auditTeamModalStyles = {
  auditTeamModal: {
    bg: '#FFFFFF',
    modal: {
      searchIcon: '#434B4F',
      inputBorder: '#cdcdd5',
    },
    radioButtonFont: '#818197',
    button: {
      add: {
        bg: '#462AC4',
        color: '#FFFFFF',
      },
      addDelegates: {
        bg: '#818197',
        color: '#FFFFFF',
      },
    },
  },
};
