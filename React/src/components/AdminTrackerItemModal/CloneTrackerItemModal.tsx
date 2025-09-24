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
        data-id="000490"
        bg="cloneTrackerItemModal.bg"
        borderRadius="20px"
        m="auto"
        maxH="auto"
        p="20px  25px"
        position="relative"
        w="325px">
      <Flex
        data-id="000491"
        flexDirection="column"
        h="100%"
        justifyContent="left">
        <Box
          data-id="000492"
          color="cloneTrackerItemModal.heading"
          fontSize="smm"
          fontWeight="bold"
          mb="15px"
          textAlign="left">
          Clone item?
          <ModalCloseButton data-id="000493" mt="5px" onClick={closeModal} />
        </Box>
        <Box
          data-id="000494"
          color="cloneTrackerItemModal.subHeading"
          fontSize="smm"
          textAlign="left"
          whiteSpace="pre">
          <Text data-id="000495">Create a clone of {trackerItem.name}</Text>
          <Text data-id="000496">The following fields will be copied to the new item:</Text>
          <UnorderedList data-id="000497" pl={3}>
            <ListItem data-id="000498">Name</ListItem>
            <ListItem data-id="000499">Description</ListItem>
            <ListItem data-id="000500">Category</ListItem>
            <ListItem data-id="000501">Regulatory Body</ListItem>
            <ListItem data-id="000502">Expires on</ListItem>
            <ListItem data-id="000503">Frequency</ListItem>
            <ListItem data-id="000504">{pluralize(capitalize(t('business unit')))}</ListItem>
            <ListItem data-id="000505">Evidence</ListItem>
            <ListItem data-id="000506">{pluralize(capitalize(t('question')))}</ListItem>
          </UnorderedList>
        </Box>
        <Flex data-id="000507" mt="34px">
          <Button
            data-id="000508"
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
            p="10px 20px">
            Cancel
          </Button>
          <Spacer data-id="000509" />
          <Button
            data-id="000510"
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCloneHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCloneBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCloneColor"
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
