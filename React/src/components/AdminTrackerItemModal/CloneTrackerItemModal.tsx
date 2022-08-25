import React, { useContext } from 'react';

import { Box, Button, Flex, ListItem, ModalCloseButton, ModalContent, Spacer, Text, UnorderedList } from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { TrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';

const CloneTrackerItemModal = ({ refetch }) => {
  const { trackerItem } = useContext(TrackerItemModalContext);
  const { cloneTrackerItem, closeModal } = useTrackerItemModal(refetch);

  return (
    <ModalContent bg="cloneTrackerItemModal.bg" borderRadius="20px" m="auto" p="20px  25px" position="relative" w="325px">
      <Flex flexDirection="column" h="100%" justifyContent="left">
        <Box color="cloneTrackerItemModal.heading" fontSize="smm" fontWeight="bold" mb="15px" textAlign="left">
          Clone item?
          <ModalCloseButton mt="5px" onClick={closeModal} />
        </Box>
        <Box color="cloneTrackerItemModal.subHeading" fontSize="smm" textAlign="left" whiteSpace="pre">
          <Text>Create a clone of {trackerItem.name}</Text>
          <Text>The following fields will be copied to the new item:</Text>
          <UnorderedList pl={3}>
            <ListItem>Name</ListItem>
            <ListItem>Description</ListItem>
            <ListItem>Category</ListItem>
            <ListItem>Regulatory Body</ListItem>
            <ListItem>Expires on</ListItem>
            <ListItem>Frequency</ListItem>
            <ListItem>{pluralize(capitalize(t('business unit')))}</ListItem>
            <ListItem>Evidence</ListItem>
            <ListItem>{pluralize(capitalize(t('question')))}</ListItem>
          </UnorderedList>
        </Box>
        <Flex mt="34px">
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCancelHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCancelBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCancelColor"
            fontSize="smm"
            mr="22px"
            onClick={closeModal}
            p="10px 20px"
          >
            Cancel
          </Button>
          <Spacer />
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCloneHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCloneBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCloneColor"
            fontSize="smm"
            onClick={() => cloneTrackerItem(trackerItem)}
            p="10px 20px"
          >
            Clone
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
};

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
