import React, { useContext } from 'react';

import {
  Box,
  Button,
  Flex,
  ListItem,
  ModalCloseButton,
  ModalContent,
  Spacer,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { capitalize } from 'lodash';
import pluralize from 'pluralize';

import { ComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';

const CloneComplianceItemModal = ({ refetch }) => {
  const { complianceItem } = useContext(ComplianceItemModalContext);
  const { cloneComplianceItem, closeModal } = useComplianceItemModal(refetch);

  return (
    <ModalContent
      bg="cloneComplianceItemModal.bg"
      borderRadius="20px"
      m="auto"
      p="20px  25px"
      position="relative"
      w="325px"
    >
      <Flex flexDirection="column" h="100%" justifyContent="left">
        <Box
          color="cloneComplianceItemModal.heading"
          fontSize="smm"
          fontWeight="bold"
          mb="15px"
          textAlign="left"
        >
          Clone item?
          <ModalCloseButton mt="5px" onClick={closeModal} />
        </Box>
        <Box
          color="cloneComplianceItemModal.subHeading"
          fontSize="smm"
          textAlign="left"
          whiteSpace="pre"
        >
          <Text>Create a clone of {complianceItem.name}</Text>
          <Text>The following fields will be copied to the new item:</Text>
          <UnorderedList pl={3}>
            <ListItem>Name</ListItem>
            <ListItem>Description</ListItem>
            <ListItem>Category</ListItem>
            <ListItem>Regulatory Body</ListItem>
            <ListItem>Expires on</ListItem>
            <ListItem>Frequency</ListItem>
            <ListItem>{pluralize(capitalize(t('businessUnit')))}</ListItem>
            <ListItem>Evidence</ListItem>
            <ListItem>Questions</ListItem>
          </UnorderedList>
        </Box>
        <Flex mt="34px">
          <Button
            _hover={{
              bg: 'cloneComplianceItemModal.buttonCancelHoverBg',
              opacity: 0.7,
            }}
            bg="cloneComplianceItemModal.buttonCancelBg"
            borderRadius="10px"
            color="cloneComplianceItemModal.buttonCancelColor"
            fontSize="smm"
            mr="22px"
            onClick={closeModal}
            p="10px 20px"
          >
            Cancel
          </Button>
          <Spacer />
          <Button
            _hover={{
              bg: 'cloneComplianceItemModal.buttonCloneHoverBg',
              opacity: 0.7,
            }}
            bg="cloneComplianceItemModal.buttonCloneBg"
            borderRadius="10px"
            color="cloneComplianceItemModal.buttonCloneColor"
            fontSize="smm"
            onClick={() => cloneComplianceItem(complianceItem)}
            p="10px 20px"
          >
            Clone
          </Button>
        </Flex>
      </Flex>
    </ModalContent>
  );
};

export default CloneComplianceItemModal;

export const cloneComplianceItemModalStyles = {
  cloneComplianceItemModal: {
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
