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
    (<Modal
      data-id="acaaf7c4a575"
      isCentered={device !== 'mobile'}
      isOpen={isParticipantsModalOpen}
      onClose={handleClose}
      scrollBehavior="inside"
      variant="teamModal">
      <ModalContent data-id="7de6be3b1c1c" m={0}>
        <ModalHeader data-id="35a466823ec4">
          <Text data-id="fabf1fe6df6f">Select {label.toLowerCase()}</Text>
          <ModalCloseButton data-id="d7a906b0937b" />
        </ModalHeader>
        <ModalBody data-id="b81119e8a50e">
          <InputGroup data-id="c7caba071414">
            <InputLeftElement data-id="91514c856e68" zIndex={50}>
              <SearchIcon data-id="1bdc5f3378fe" fill="participantsModal.modal.searchIcon" />
            </InputLeftElement>
            <Input
              autoFocus
              borderColor="participantsModal.modal.inputBorder"
              borderWidth="1px"
              data-id="d653dd6bae3a"
              fontSize="smm"
              h="40px"
              mb={0}
              onChange={({ target: { value } }) => {
                onQueryChanged(value);
              }}
              placeholder="Name"
              rounded="10px"
              value={searchQuery}
              zIndex={2} />
          </InputGroup>

          <Flex data-id="4f7d7529faae">
            {maxParticipants === undefined ||
              (maxParticipants > 1 && (
                <Text
                  color="participantsModal.radioButtonFont"
                  data-id="c8da9a1ae6ec"
                  fontSize="smm"
                  fontWeight="semi_medium"
                  ml="2"
                  mt={2}>
                  {`${selectedParticipants.length} ${pluralize('user', selectedParticipants.length)}`} selected
                </Text>
              ))}
          </Flex>

          <Flex
            data-id="ab9d60baded7"
            direction="column"
            maxH={['full', '258px']}
            mt="20px">
            {usersList.length > 0 && (
              <VStack
                align="start"
                alignItems="flex-start"
                data-id="55f99ddad5b5"
                h="full"
                overflow="auto"
                spacing={2}>
                {[
                  ...usersList.filter(({ _id }) => isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                  ...usersList.filter(({ _id }) => !isParticipantSelected(_id)).sort((a, b) => a.displayName.localeCompare(b.displayName)),
                ].map((user) => (
                  <ParticipantListItem
                    data-id="ce24c45bf549"
                    isSelected={isParticipantSelected(user._id)}
                    key={user._id}
                    onSelectParticipant={selectParticipant}
                    user={user} />
                ))}
              </VStack>
            )}
            {loading ? (
              <HStack
                align="center"
                data-id="31c0a5916963"
                fontSize="smm"
                fontStyle="italic"
                h="40px"
                justify="flexStart"
                spacing={2}
                w="full">
                <Loader center data-id="fa1a6b080dff" size="sm" w="20px" />
                <Text data-id="640b8ac59ee4">Searching...</Text>
              </HStack>
            ) : (
              usersList.length === selectedParticipants.length &&
              searchQuery && (
                <Flex
                  align="center"
                  data-id="7d0ca98a9832"
                  fontSize="smm"
                  fontStyle="italic"
                  h="40px">
                  No {selectedParticipants.length > 0 ? 'more ' : ''} results found
                </Flex>
              )
            )}
          </Flex>
        </ModalBody>
        <ModalFooter data-id="5dda87a08b6b" pt="0px">
          <Button
            _hover={{ bg: 'participantsModal.button.bg' }}
            bg="participantsModal.button.bg"
            color="participantsModal.button.color"
            data-id="958f06bdef83"
            fontSize="smm"
            fontWeight="bold"
            h="38px"
            mb={['44px', '6px']}
            mr="1px"
            onClick={closeParticipantsModal}
            w="68px">
            {canDelete ? 'Close' : 'Replace'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>)
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
