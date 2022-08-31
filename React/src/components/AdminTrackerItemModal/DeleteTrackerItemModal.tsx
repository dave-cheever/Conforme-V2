import React, { useContext } from 'react';

import { Box, Button, Flex, ModalContent } from '@chakra-ui/react';

import { TrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';
import { CrossIcon } from '../../icons';

const DeleteTrackerItemModal = ({ refetch }) => {
  const { trackerItem } = useContext(TrackerItemModalContext);
  const { deleteTrackerItem, closeModal } = useTrackerItemModal(refetch);

  return (
    <ModalContent bg="deleteTrackerItemModal.bg" borderRadius="20px" m="auto" maxH="auto" p="20px  25px" position="relative" w="330px">
      <Flex flexDirection="column" h="100%" justifyContent="left">
        <Flex color="deleteTrackerItemModal.heading" fontSize="xxl" fontWeight="bold" justifyContent="space-between" mb="15px" w="full">
          Delete item?
          <CrossIcon cursor="pointer" onClick={closeModal} stroke="deleteTrackerItemModal.crossIcon" w="20px" />
        </Flex>
        <Box color="deleteTrackerItemModal.subHeading" whiteSpace="pre">
          The action cannot be undone.
        </Box>
        <Flex justifyContent="space-between" mt="40px">
          <Button
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
            _hover={{
              bg: 'deleteTrackerItemModal.buttonRemoveHoverBg',
              opacity: 0.7,
            }}
            bg="deleteTrackerItemModal.buttonRemoveBg"
            borderRadius="4px"
            color="deleteTrackerItemModal.buttonRemoveColor"
            fontSize="smm"
            onClick={() => deleteTrackerItem(trackerItem)}
            p="10px 20px"
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
};

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
