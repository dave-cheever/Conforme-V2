import { useCallback } from 'react';

import { SearchIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  HStack,
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
import pluralize from 'pluralize';

import { useParticipantsModalContext } from '../../contexts/ParticipantsModalProvider';
import useDevice from '../../hooks/useDevice';
import Loader from '../Loader';
import ParticipantListItem from './ParticipantListItem';

const ParticipantsModal = () => {
  const device = useDevice();
  const {
    label,
    usersList,
    isParticipantsModalOpen,
    closeParticipantsModal,
    loading,
    searchQuery,
    setSearchQuery,
    selectedParticipants,
    maxParticipants,
    canDelete,
    isParticipantSelected,
    selectParticipant,
  } = useParticipantsModalContext();

  const handleClose = () => {
    closeParticipantsModal();
    setSearchQuery('');
  };

  // debounce query to make less request on server.
  const setDelayQuery = useCallback(
    debounce((q) => {
      setSearchQuery(q);
    }, 1000),
    [],
  );

  const onQueryChanged = (query: string) => {
    setSearchQuery(query);
    setDelayQuery(query);
  };

  return (
    <Modal
      isCentered={device !== 'mobile'}
      isOpen={isParticipantsModalOpen}
      onClose={handleClose}
      scrollBehavior="inside"
      variant="teamModal"
    >
      <ModalContent m={0}>
        <ModalHeader>
          <Text>Select {label.toLowerCase()}</Text>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputLeftElement zIndex={50}>
              <SearchIcon fill="participantsModal.modal.searchIcon" />
            </InputLeftElement>
            <Input
              autoFocus
              borderColor="participantsModal.modal.inputBorder"
              borderWidth="1px"
              fontSize="smm"
              h="40px"
              mb={0}
              onChange={({ target: { value } }) => {
                onQueryChanged(value);
              }}
              placeholder="Name"
              rounded="10px"
              value={searchQuery}
              zIndex={2}
            />
          </InputGroup>

          <Flex>
            {maxParticipants === undefined ||
              (maxParticipants > 1 && (
                <Text color="participantsModal.radioButtonFont" fontSize="smm" fontWeight="semi_medium" ml="2" mt={2}>
                  {`${selectedParticipants.length} ${pluralize('user', selectedParticipants.length)}`} selected
                </Text>
              ))}
          </Flex>

          <Flex direction="column" maxH={['full', '258px']} mt="20px">
            {usersList.length > 0 && (
              <VStack align="start" alignItems="flex-start" h="full" overflow="auto" spacing={2}>
                {[
                  ...usersList.filter(({ _id }) => isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                  ...usersList.filter(({ _id }) => !isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                ].map((user) => (
                  <ParticipantListItem
                    isSelected={isParticipantSelected(user._id)}
                    key={user._id}
                    onSelectParticipant={selectParticipant}
                    user={user}
                  />
                ))}
              </VStack>
            )}
            {loading ? (
              <HStack align="center" fontSize="smm" fontStyle="italic" h="40px" justify="flexStart" spacing={2} w="full">
                <Loader center size="sm" w="20px" />
                <Text>Searching...</Text>
              </HStack>
            ) : (
              usersList.length === selectedParticipants.length &&
              searchQuery && (
                <Flex align="center" fontSize="smm" fontStyle="italic" h="40px">
                  No {selectedParticipants.length > 0 ? 'more ' : ''} results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter pt="0px">
          <Button
            _hover={{ bg: 'participantsModal.button.bg' }}
            bg="participantsModal.button.bg"
            color="participantsModal.button.color"
            fontSize="smm"
            fontWeight="bold"
            h="38px"
            mb={['44px', '6px']}
            mr="1px"
            onClick={closeParticipantsModal}
            w="68px"
          >
            {canDelete ? 'Close' : 'Replace'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ParticipantsModal;

export const participantsModalStyles = {
  participantsModal: {
    modal: {
      searchIcon: '#434B4F',
      inputBorder: '#cdcdd5',
    },
    radioButtonFont: '#818197',
    button: {
      bg: '#462AC4',
      color: '#FFFFFF',
    },
  },
};
