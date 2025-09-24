import React, { useContext } from 'react';

import { Box, Button, Flex, ModalContent } from '@chakra-ui/react';

import { TrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';
import { CrossIcon } from '../../icons';

function DeleteTrackerItemModal({ refetch, onItemDeleted }) {
  const { trackerItem } = useContext(TrackerItemModalContext);
  const { deleteTrackerItem, closeModal } = useTrackerItemModal(refetch);

  const handleDelete = async () => {
    try {
      await deleteTrackerItem(trackerItem);
      if (onItemDeleted) onItemDeleted();
      if (refetch) refetch();
    } catch (error) {
      console.error('Error deleting tracker item:', error);
    }
  };

  return (
    <ModalContent
      data-id="000482"
      bg="deleteTrackerItemModal.bg"
      borderRadius="20px"
      m="auto"
      maxH="auto"
      p="20px  25px"
      position="relative"
      w="330px"
    >
      <Flex data-id="000483" flexDirection="column" h="100%" justifyContent="left">
        <Flex
          data-id="000484"
          color="deleteTrackerItemModal.heading"
          fontSize="xxl"
          fontWeight="bold"
          justifyContent="space-between"
          mb="15px"
          w="full"
        >
          Delete item?
          <CrossIcon data-id="000485" cursor="pointer" onClick={closeModal} stroke="deleteTrackerItemModal.crossIcon" w="20px" />
        </Flex>
        <Box data-id="000486" color="deleteTrackerItemModal.subHeading" whiteSpace="pre">
          The action cannot be undone.
        </Box>
        <Flex data-id="000487" justifyContent="space-between" mt="40px">
          <Button
            data-id="000488"
            _hover={{
              backgroundColor: 'deleteTrackerItemModal.buttonKeepHoverBg',
            }}
            bg="deleteTrackerItemModal.buttonKeepBg"
            borderRadius="4px"
            color="deleteTrackerItemModal.buttonKeepColor"
            mr="22px"
            onClick={closeModal}
            p="10px 20px"
          >
            Keep
          </Button>
          <Button
            data-id="000489"
            _hover={{
              bg: 'deleteTrackerItemModal.buttonRemoveHoverBg',
              opacity: 0.7,
            }}
            bg="deleteTrackerItemModal.buttonRemoveBg"
            borderRadius="4px"
            color="deleteTrackerItemModal.buttonRemoveColor"
            fontSize="smm"
            onClick={handleDelete}
            p="10px 20px"
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
}

export const deleteTrackerItemModalStyles = {
  deleteTrackerItemModal: {
    bg: '#FFFFFF',
    heading: '#313233',
    subHeading: '#818197',
    buttonKeepColor: '#818197',
    buttonKeepBg: '#F0F2F5',
    buttonKeepHoverBg: '#F0F2F5',
    buttonRemoveColor: '#FFFFFF',
    buttonRemoveBg: '#E93C44',
    buttonRemoveHoverBg: '#E93C44',
    crossIcon: '#282F36',
  },
};

export default DeleteTrackerItemModal;
