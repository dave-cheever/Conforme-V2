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
import { preventFocusRestore } from '../../utils/focusUtils';
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
    // Prevent focus from returning to search bar after modal closes
    preventFocusRestore();
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
      data-id="000622"
      isCentered={device !== 'mobile'}
      isOpen={isParticipantsModalOpen}
      onClose={handleClose}
      returnFocusOnClose={false}
      scrollBehavior="inside"
      variant="teamModal"
    >
      <ModalContent data-id="000623" m={0}>
        <ModalHeader data-id="000624">
          <Text data-id="000625">Select {label.toLowerCase()}</Text>
          <ModalCloseButton data-id="000626" />
        </ModalHeader>
        <ModalBody data-id="000627">
          <InputGroup data-id="000628">
            <InputLeftElement data-id="000629" zIndex={50}>
              <SearchIcon data-id="000630" fill="participantsModal.modal.searchIcon" />
            </InputLeftElement>
            <Input
              autoFocus
              borderColor="participantsModal.modal.inputBorder"
              borderWidth="1px"
              data-id="000631"
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

          <Flex data-id="000632">
            {maxParticipants === undefined ||
              (maxParticipants > 1 && (
                <Text
                  color="participantsModal.radioButtonFont"
                  data-id="000633"
                  fontSize="smm"
                  fontWeight="semi_medium"
                  ml="2"
                  mt={2}
                >
                  {`${selectedParticipants.length} ${pluralize('user', selectedParticipants.length)}`} selected
                </Text>
              ))}
          </Flex>

          <Flex data-id="000634" direction="column" maxH={['full', '258px']} mt="20px">
            {usersList.length > 0 && (
              <VStack align="start" alignItems="flex-start" data-id="000635" h="full" overflow="auto" spacing={2}>
                {[
                  ...usersList.filter(({ _id }) => isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                  ...usersList.filter(({ _id }) => !isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                ].map((user) => (
                  <ParticipantListItem
                    data-id="000636"
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
                align="center"
                data-id="000637"
                fontSize="smm"
                fontStyle="italic"
                h="40px"
                justify="flexStart"
                spacing={2}
                w="full"
              >
                <Loader center data-id="000638" size="sm" w="20px" />
                <Text data-id="000639">Searching...</Text>
              </HStack>
            ) : (
              usersList.length === selectedParticipants.length &&
              searchQuery && (
                <Flex align="center" data-id="000640" fontSize="smm" fontStyle="italic" h="40px">
                  No {selectedParticipants.length > 0 ? 'more ' : ''} results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter data-id="000641" pt="0px">
          <Button
            _hover={{ bg: 'participantsModal.button.bg' }}
            bg="participantsModal.button.bg"
            color="participantsModal.button.color"
            data-id="000642"
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
