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

function ParticipantsModal() {
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
      data-id="030925-62e0d8"
      isCentered={device !== 'mobile'}
      isOpen={isParticipantsModalOpen}
      onClose={handleClose}
      scrollBehavior="inside"
      variant="teamModal"
    >
      <ModalContent data-id="030925-b9076f" m={0}>
        <ModalHeader data-id="030925-3ac17d">
          <Text data-id="030925-df006e">Select {label.toLowerCase()}</Text>
          <ModalCloseButton data-id="030925-2f038a" />
        </ModalHeader>
        <ModalBody data-id="030925-5f8fd4">
          <InputGroup data-id="030925-350f8c">
            <InputLeftElement data-id="030925-9192b7" zIndex={50}>
              <SearchIcon data-id="030925-1ba0aa" fill="participantsModal.modal.searchIcon" />
            </InputLeftElement>
            <Input
              data-id="030925-d612a7"
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

          <Flex data-id="030925-ad9e16">
            {maxParticipants === undefined ||
              (maxParticipants > 1 && (
                <Text
                  data-id="030925-64bce7"
                  color="participantsModal.radioButtonFont"
                  fontSize="smm"
                  fontWeight="semi_medium"
                  ml="2"
                  mt={2}
                >
                  {`${selectedParticipants.length} ${pluralize('user', selectedParticipants.length)}`} selected
                </Text>
              ))}
          </Flex>

          <Flex data-id="030925-37dec2" direction="column" maxH={['full', '258px']} mt="20px">
            {usersList.length > 0 && (
              <VStack data-id="030925-40f9bf" align="start" alignItems="flex-start" h="full" overflow="auto" spacing={2}>
                {[
                  ...usersList.filter(({ _id }) => isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                  ...usersList.filter(({ _id }) => !isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                ].map((user) => (
                  <ParticipantListItem
                    data-id="030925-123aa3"
                    isSelected={isParticipantSelected(user._id)}
                    key={user._id}
                    onSelectParticipant={selectParticipant}
                    user={user}
                  />
                ))}
              </VStack>
            )}
            {loading ? (
              <HStack
                data-id="030925-4e562d"
                align="center"
                fontSize="smm"
                fontStyle="italic"
                h="40px"
                justify="flexStart"
                spacing={2}
                w="full"
              >
                <Loader data-id="030925-598581" center size="sm" w="20px" />
                <Text data-id="030925-453563">Searching...</Text>
              </HStack>
            ) : (
              usersList.length === selectedParticipants.length &&
              searchQuery && (
                <Flex data-id="030925-dfdbd7" align="center" fontSize="smm" fontStyle="italic" h="40px">
                  No {selectedParticipants.length > 0 ? 'more ' : ''} results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter data-id="030925-53f547" pt="0px">
          <Button
            data-id="030925-5549dd"
            _hover={{ bg: 'participantsModal.button.bg' }}
            bg="participantsModal.button.bg"
            color="participantsModal.button.color"
            fontSize="smm"
            fontWeight="bold"
            h="38px"
            mb={['44px', '6px']}
            mr="1px"
            onClick={closeParticipantsModal}
            w="fit-content"
          >
            {canDelete ? 'Close' : 'Replace'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

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
