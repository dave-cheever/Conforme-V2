import React, { useContext } from 'react';

import { Box, Button, Flex, ListItem, ModalCloseButton, ModalContent, Spacer, Text, UnorderedList } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { TrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';

function CloneTrackerItemModal({ refetch }) {
  const { trackerItem } = useContext(TrackerItemModalContext);
  const { cloneTrackerItem, closeModal } = useTrackerItemModal(refetch);

  return (
    <ModalContent
        bg="cloneTrackerItemModal.bg"
        borderRadius="20px"
        data-id="030925-4b083b"
        m="auto"
        maxH="auto"
        p="20px  25px"
        position="relative"
        w="325px">
      <Flex
        data-id="030925-007431"
        flexDirection="column"
        h="100%"
        justifyContent="left">
        <Box
          color="cloneTrackerItemModal.heading"
          data-id="030925-57ab07"
          fontSize="smm"
          fontWeight="bold"
          mb="15px"
          textAlign="left">
          Clone item?
          <ModalCloseButton data-id="030925-f3f126" mt="5px" onClick={closeModal} />
        </Box>
        <Box
          color="cloneTrackerItemModal.subHeading"
          data-id="030925-986295"
          fontSize="smm"
          textAlign="left"
          whiteSpace="pre">
          <Text data-id="030925-8764e8">Create a clone of {trackerItem.name}</Text>
          <Text data-id="030925-4e3e44">The following fields will be copied to the new item:</Text>
          <UnorderedList data-id="030925-e7387e" pl={3}>
            <ListItem data-id="030925-5742ce">Name</ListItem>
            <ListItem data-id="030925-800f4f">Description</ListItem>
            <ListItem data-id="030925-da07b8">Category</ListItem>
            <ListItem data-id="030925-602ffb">Regulatory Body</ListItem>
            <ListItem data-id="030925-e290fa">Expires on</ListItem>
            <ListItem data-id="030925-ad264d">Frequency</ListItem>
            <ListItem data-id="030925-c09130">{pluralize(capitalize(t('business unit')))}</ListItem>
            <ListItem data-id="030925-cc08c1">Evidence</ListItem>
            <ListItem data-id="030925-a75ee2">{pluralize(capitalize(t('question')))}</ListItem>
          </UnorderedList>
        </Box>
        <Flex data-id="030925-8cc7ce" mt="34px">
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCancelHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCancelBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCancelColor"
            data-id="030925-a0e1e4"
            fontSize="smm"
            mr="22px"
            onClick={closeModal}
            p="10px 20px">
            Cancel
          </Button>
          <Spacer data-id="030925-8b173c" />
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCloneHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCloneBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCloneColor"
            data-id="030925-a35ae0"
            fontSize="smm"
            onClick={() => cloneTrackerItem(trackerItem)}
            p="10px 20px">
            Clone
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
}

export default CloneTrackerItemModal;

export const cloneTrackerItemModalStyles = {
  cloneTrackerItemModal: {
    bg: '#FFFFFF',
    heading: '#313233',
    subHeading: '#818197',
    buttonCancelColor: '#818197',
    buttonCancelBg: '#F0F2F5',
    buttonCancelHoverBg: '#F0F2F5',
    buttonCloneColor: '#FFFFFF',
    buttonCloneBg: '#462AC4',
    buttonCloneHoverBg: '#462AC4',
  },
};
