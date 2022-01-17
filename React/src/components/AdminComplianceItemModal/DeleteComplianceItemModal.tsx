import React, { useContext } from 'react';
import {
  ModalContent,
  Flex,
  Box,
  Button,
} from '@chakra-ui/react';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import { CrossIcon } from '../../icons';

const DeleteComplianceItemModal = ({ refetch }) => {
  const {
    complianceItem,
  } = useContext(ComplianceItemModalContext);
  const {
    deleteComplianceItem,
    closeModal,
  } = useComplianceItemModal(refetch);

  return (
    <ModalContent
      w="330px"
      bg="deleteComplianceItemModal.bg"
      borderRadius="20px"
      position="relative"
      p="20px  25px"
      m="auto"
    >
      <Flex h="100%" flexDirection="column" justifyContent="left">
        <Flex
          fontSize="xxl"
          fontWeight="bold"
          color="deleteComplianceItemModal.heading"
          mb="15px"
          w="full"
          justifyContent="space-between"
        >Remove item?
          <CrossIcon onClick={closeModal} stroke="deleteComplianceItemModal.crossIcon" w="20px" cursor="pointer"  />
        </Flex>
        <Box
          whiteSpace="pre"
          color="deleteComplianceItemModal.subHeading"
        >
          The action cannot be undone.
        </Box>
        <Flex mt="40px" justifyContent="space-between">
          <Button
            color="deleteComplianceItemModal.buttonKeepColor"
            p="10px 20px"
            bg="deleteComplianceItemModal.buttonKeepBg"
            _hover={{ backgroundColor: "deleteComplianceItemModal.buttonKeepHoverBg" }}
            borderRadius="4px"
            mr="22px"
            onClick={closeModal}
          >Keep</Button>
          <Button
            p="10px 20px"
            borderRadius="4px"
            bg="deleteComplianceItemModal.buttonRemoveBg"
            color="deleteComplianceItemModal.buttonRemoveColor"
            _hover={{ bg: "deleteComplianceItemModal.buttonRemoveHoverBg", opacity: 0.7 }}
            fontSize="smm"
            onClick={() => deleteComplianceItem(complianceItem)}>
            Delete
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  )
};

export const deleteComplianceItemModalStyles = {
  deleteComplianceItemModal: {
    bg: "#FFFFFF",
    heading: "#313233",
    subHeading: "#818197",
    buttonKeepColor: "#818197",
    buttonKeepBg: "#F0F2F5",
    buttonKeepHoverBg: "#F0F2F5",
    buttonRemoveColor: "#FFFFFF",
    buttonRemoveBg: "#E93C44",
    buttonRemoveHoverBg: "#E93C44",
    crossIcon:"#282F36"
  }
}

export default DeleteComplianceItemModal;
