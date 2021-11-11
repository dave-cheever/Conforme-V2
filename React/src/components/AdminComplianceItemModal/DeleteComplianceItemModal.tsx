import React, { useContext } from 'react';
import {
  ModalContent,
  Flex,
  Box,
  Button
} from '@chakra-ui/react';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import { IComplianceItem } from '../../interfaces/IComplianceItem';

const DeleteComplianceItemModal = () => {
  const {
    complianceItem,
  } = useContext(ComplianceItemModalContext);
  const {
    deleteComplianceItem,
    closeModal,
  } = useComplianceItemModal();

  return (
    <ModalContent
      bg="rgba(67, 76, 81, 0.95)"
      h={["100vh", "calc(100vh - 30px)"]}
      borderRadius={["0", "20px"]}
      position="absolute"
      top={["-60px", "-45px"]}
      right={["0", "15px"]}
    >
      <Flex h="100%" alignItems="center" flexDirection="column" justifyContent="center">
        <Box fontSize="xxl" fontWeight="bold" color="white" mb="45px">Remove {complianceItem.name}</Box>
        <Box
          whiteSpace="pre"
          color="white"
          textAlign="center"
        >
          {`All the information will be lost and you will need \n to re-create it from scratch.`}
        </Box>
        <Box mt="34px">
          <Button
            color="white"
            p="10px 40px"
            bg="brand.primary"
            borderRadius="4px"
            mr="22px"
            onClick={closeModal}
          >Keep</Button>
          <Button p="10px 40px" borderRadius="4px" onClick={() => deleteComplianceItem(complianceItem as IComplianceItem)}>Remove</Button>
        </Box>
      </Flex>
    </ModalContent>
  )
};

export default DeleteComplianceItemModal;
