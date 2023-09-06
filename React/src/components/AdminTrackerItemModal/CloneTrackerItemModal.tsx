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
    (<ModalContent
      bg="cloneTrackerItemModal.bg"
      borderRadius="20px"
      data-id="4fdfa2caeab8"
      m="auto"
      maxH="auto"
      p="20px  25px"
      position="relative"
      w="325px">
      <Flex
        data-id="4e93b057b47a"
        flexDirection="column"
        h="100%"
        justifyContent="left">
        <Box
          color="cloneTrackerItemModal.heading"
          data-id="ddf789b53fbc"
          fontSize="smm"
          fontWeight="bold"
          mb="15px"
          textAlign="left">
          Clone item?
          <ModalCloseButton data-id="27b91262a175" mt="5px" onClick={closeModal} />
        </Box>
        <Box
          color="cloneTrackerItemModal.subHeading"
          data-id="fb2285147a6f"
          fontSize="smm"
          textAlign="left"
          whiteSpace="pre">
          <Text data-id="a989e8fec34a">Create a clone of {trackerItem.name}</Text>
          <Text data-id="6979ce93f80c">The following fields will be copied to the new item:</Text>
          <UnorderedList data-id="f5832d2cc249" pl={3}>
            <ListItem data-id="f26b30e9d778">Name</ListItem>
            <ListItem data-id="531f84c54e9d">Description</ListItem>
            <ListItem data-id="aafb74d4b00c">Category</ListItem>
            <ListItem data-id="ad5ddf1635c2">Regulatory Body</ListItem>
            <ListItem data-id="f6c017faea3e">Expires on</ListItem>
            <ListItem data-id="350c315fec33">Frequency</ListItem>
            <ListItem data-id="4bb0aba8d5af">{pluralize(capitalize(t('business unit')))}</ListItem>
            <ListItem data-id="750feaabb1e5">Evidence</ListItem>
            <ListItem data-id="ae0b17352e5e">{pluralize(capitalize(t('question')))}</ListItem>
          </UnorderedList>
        </Box>
        <Flex data-id="96d3acdcdc2b" mt="34px">
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCancelHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCancelBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCancelColor"
            data-id="50427dade998"
            fontSize="smm"
            mr="22px"
            onClick={closeModal}
            p="10px 20px">
            Cancel
          </Button>
          <Spacer data-id="6fc6fb4d8808" />
          <Button
            _hover={{
              bg: 'cloneTrackerItemModal.buttonCloneHoverBg',
              opacity: 0.7,
            }}
            bg="cloneTrackerItemModal.buttonCloneBg"
            borderRadius="10px"
            color="cloneTrackerItemModal.buttonCloneColor"
            data-id="9337aa2706d6"
            fontSize="smm"
            onClick={() => cloneTrackerItem(trackerItem)}
            p="10px 20px">
            Clone
          </Button>
        </Flex>
      </Flex>
    </ModalContent>)
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
