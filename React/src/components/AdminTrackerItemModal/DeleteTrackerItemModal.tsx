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
      bg="deleteTrackerItemModal.bg"
      borderRadius="20px"
      data-id="eb5262a3dd85"
      m="auto"
      maxH="auto"
      p="20px  25px"
      position="relative"
      w="330px"
    >
      <Flex data-id="9781856ae8c8" flexDirection="column" h="100%" justifyContent="left">
        <Flex
          color="deleteTrackerItemModal.heading"
          data-id="e5fab8d7bac9"
          fontSize="xxl"
          fontWeight="bold"
          justifyContent="space-between"
          mb="15px"
          w="full"
        >
          Delete item?
          <CrossIcon cursor="pointer" data-id="82225449b377" onClick={closeModal} stroke="deleteTrackerItemModal.crossIcon" w="20px" />
        </Flex>
        <Box color="deleteTrackerItemModal.subHeading" data-id="bac4c37aff43" whiteSpace="pre">
          The action cannot be undone.
        </Box>
        <Flex data-id="d47a10a21695" justifyContent="space-between" mt="40px">
          <Button
            _hover={{
              backgroundColor: 'deleteTrackerItemModal.buttonKeepHoverBg',
            }}
            bg="deleteTrackerItemModal.buttonKeepBg"
            borderRadius="4px"
            color="deleteTrackerItemModal.buttonKeepColor"
            data-id="b2c11e90f450"
            mr="22px"
            onClick={closeModal}
            p="10px 20px"
          >
            Keep
          </Button>
          <Button
            _hover={{
              bg: 'deleteTrackerItemModal.buttonRemoveHoverBg',
              opacity: 0.7,
            }}
            bg="deleteTrackerItemModal.buttonRemoveBg"
            borderRadius="4px"
            color="deleteTrackerItemModal.buttonRemoveColor"
            data-id="dcedfd6a7205"
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
