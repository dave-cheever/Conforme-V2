import React, { useContext } from 'react';
import {
  ModalContent,
  Flex,
  Box,
  Button
} from '@chakra-ui/react';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';

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
      bg="adminComplianceItemModal.delete.bg"
      h={["100vh", "calc(100vh - 30px)"]}
      borderRadius={["0", "20px"]}
      position="absolute"
      top={["-60px", "-45px"]}
      right={["0", "15px"]}
    >
      <Flex h="100%" alignItems="center" flexDirection="column" justifyContent="center">
        <Box fontSize="xxl" fontWeight="bold" color="adminComplianceItemModal.delete.font" mb="45px">Remove {complianceItem.name}</Box>
        <Box
          whiteSpace="pre"
          color="adminComplianceItemModal.delete.font"
          textAlign="center"
        >
          {`All the information will be lost and you will need \n to re-create it from scratch.`}
        </Box>
        <Box mt="34px">
          <Button
            color="adminComplianceItemModal.delete.keep.font"
            p="10px 40px"
            bg="adminComplianceItemModal.delete.keep.bg"
            _hover={{ backgroundColor: "adminComplianceItemModal.delete.keep.hover" }}
            borderRadius="4px"
            mr="22px"
            onClick={closeModal}
          >Keep</Button>
          <Button p="10px 40px" borderRadius="4px" onClick={() => deleteComplianceItem(complianceItem)}>Remove</Button>
        </Box>
      </Flex>
    </ModalContent>
  )
};

export default DeleteComplianceItemModal;
