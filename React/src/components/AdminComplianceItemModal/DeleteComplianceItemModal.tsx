import React, { useContext } from 'react';

import { Box, Button, Flex, ModalContent } from '@chakra-ui/react';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import { CrossIcon } from '../../icons';

const DeleteComplianceItemModal = ({ refetch }) => {
  const { complianceItem } = useContext(ComplianceItemModalContext);
  const { deleteComplianceItem, closeModal } = useComplianceItemModal(refetch);

  return (
    <ModalContent bg="deleteComplianceItemModal.bg" borderRadius="20px" m="auto" p="20px  25px" position="relative" w="330px">
      <Flex flexDirection="column" h="100%" justifyContent="left">
        <Flex color="deleteComplianceItemModal.heading" fontSize="xxl" fontWeight="bold" justifyContent="space-between" mb="15px" w="full">
          Delete item?
          <CrossIcon cursor="pointer" onClick={closeModal} stroke="deleteComplianceItemModal.crossIcon" w="20px" />
        </Flex>
        <Box color="deleteComplianceItemModal.subHeading" whiteSpace="pre">
          The action cannot be undone.
        </Box>
        <Flex justifyContent="space-between" mt="40px">
          <Button
            _hover={{
              backgroundColor: 'deleteComplianceItemModal.buttonKeepHoverBg',
            }}
            bg="deleteComplianceItemModal.buttonKeepBg"
            borderRadius="4px"
            color="deleteComplianceItemModal.buttonKeepColor"
            mr="22px"
            onClick={closeModal}
            p="10px 20px"
          >
            Keep
          </Button>
          <Button
            _hover={{
              bg: 'deleteComplianceItemModal.buttonRemoveHoverBg',
              opacity: 0.7,
            }}
            bg="deleteComplianceItemModal.buttonRemoveBg"
            borderRadius="4px"
            color="deleteComplianceItemModal.buttonRemoveColor"
            fontSize="smm"
            onClick={() => deleteComplianceItem(complianceItem)}
            p="10px 20px"
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
};

export const deleteComplianceItemModalStyles = {
  deleteComplianceItemModal: {
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

export default DeleteComplianceItemModal;
