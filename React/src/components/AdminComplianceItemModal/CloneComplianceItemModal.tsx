import React, { useContext } from 'react';
import {
  Box,
  Button,
  Text,
  Flex,
  ModalContent,
  ModalCloseButton,
  Spacer,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';

const CloneComplianceItemModal = ({ refetch }) => {
  const {
    complianceItem,
  } = useContext(ComplianceItemModalContext);
  const {
    cloneComplianceItem,
    closeModal,
  } = useComplianceItemModal(refetch);

  return (
    <ModalContent
      bg="cloneComplianceItemModal.bg"
      w="325px"
      borderRadius="20px"
      position="relative"
      m="auto"
      p="20px  25px"
    >
      <Flex h="100%" flexDirection="column" justifyContent="left">
        <Box
          textAlign="left"
          fontSize="smm"
          fontWeight="bold"
          color="cloneComplianceItemModal.heading"
          mb="15px"
        >Clone item?
          <ModalCloseButton mt="5px" onClick={closeModal} />
        </Box>
        <Box
          whiteSpace="pre"
          color="cloneComplianceItemModal.subHeading"
          textAlign="left"
          fontSize="smm"
        >
          <Text>Create a clone of {complianceItem.name}</Text>
          <Text>The following fields will be copied to the new item:</Text>
          <UnorderedList pl={3}>
            <ListItem>Name</ListItem>
            <ListItem>Description</ListItem>
            <ListItem>Category</ListItem>
            <ListItem>Regulatory Body</ListItem>
            <ListItem>Due Date</ListItem>
            <ListItem>Frequency</ListItem>
            <ListItem>Business Unit</ListItem>
            <ListItem>Evidence</ListItem>
            <ListItem>Questions</ListItem>
          </UnorderedList>
        </Box>
        <Flex mt="34px">
          <Button
            color="cloneComplianceItemModal.buttonCancelColor"
            p="10px 20px"
            bg="cloneComplianceItemModal.buttonCancelBg"
            borderRadius="10px"
            mr="22px"
            fontSize="smm"
            onClick={closeModal}
            _hover={{ bg: "cloneComplianceItemModal.buttonCancelHoverBg", opacity: 0.7 }}
          >Cancel</Button>
          <Spacer />
          <Button
            bg="cloneComplianceItemModal.buttonCloneBg"
            color="cloneComplianceItemModal.buttonCloneColor"
            p="10px 20px"
            fontSize="smm"
            borderRadius="10px"
            onClick={() => cloneComplianceItem(complianceItem)}
            _hover={{ bg: "cloneComplianceItemModal.buttonCloneHoverBg", opacity: 0.7 }}
          >Clone</Button>
        </Flex>
      </Flex>
    </ModalContent>
  )
};

export default CloneComplianceItemModal;

export const cloneComplianceItemModalStyles = {
  cloneComplianceItemModal: {
    bg: "#FFFFFF",
    heading: "#313233",
    subHeading: "#818197",
    buttonCancelColor: "#818197",
    buttonCancelBg: "#F0F2F5",
    buttonCancelHoverBg: "#F0F2F5",
    buttonCloneColor: "#FFFFFF",
    buttonCloneBg: "#462AC4",
    buttonCloneHoverBg: "#462AC4",
  }
}
