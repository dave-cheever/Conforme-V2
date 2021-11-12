import React, { useMemo } from 'react';
import {
  ModalContent,
  ModalHeader,
  Flex,
  Avatar,
  Box,
  ModalCloseButton,
  ModalBody,
  Accordion,
  ModalFooter,
  Button,
  Spacer,
  useToast,
} from '@chakra-ui/react';

import AlertDialog from '../AlertDialog';
import { toastFailed } from '../../bootstrap/config';
import { complianceItemModalSections, initialDialogDetails, useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import { useAppContext } from '../../contexts/AppProvider';
import ComplianceItemModalSection from './ComplianceItemModalSection';

const ComplianceItemModal = ({ refetch }) => {
  const toast = useToast();
  const { user } = useAppContext();

  const {
    complianceItem,
    errors, trigger,
    savingDialogDetails, setSavingDialogDetails,
    selectedSection, selectedSectionIndex, setSelectedSection,
  } = useComplianceItemModalContext();
  const {
    saveComplianceItem,
    closeModal,
  } = useComplianceItemModal(refetch);

  // Boolean summarizing if at least one evidence is experted OR at least one required question is added
  const isActionRequiredToComplete = useMemo(() => (complianceItem.evidenceItems || []).length > 0 ||
    (complianceItem.questions || []).filter(({ required, outdated }) => required && !outdated)?.length > 0, [complianceItem]);

  const handlePrimaryButtonClick = () => {
    if (selectedSection.name === 'Summary') {
      // If user on Summary page
      if (complianceItem.published) {
        // And CI is published
        const savingDialogDetails = {
          isOpen: true,
          title: `Unpublish ${complianceItem.name}`,
          description: "Are you sure you wish to unpublish this compliance item? It will hide all existing responses.",
          state: undefined,
          showButtons: true,
          action: () => saveComplianceItem({
            ...complianceItem,
            published: false,
          }),
        };
        return setSavingDialogDetails(savingDialogDetails);
      }
      if (Object.keys(errors).length > 0) {
        // If CI is not published and there are errors
        return toast({ ...toastFailed, description: 'Please complete all the required fields' });
      }

      // If CI is not published
      const savingDialogDetails = {
        isOpen: true,
        title: `Publish ${complianceItem.name}`,
        description: "Are you sure you wish to publish this compliance item? It will become available for completion by all relevant sites.",
        state: undefined,
        showButtons: true,
        action: () => saveComplianceItem({
          ...complianceItem,
          published: true,
        }),
      };
      return setSavingDialogDetails(savingDialogDetails);
    }

    const nextPage = complianceItemModalSections[Object.keys(complianceItemModalSections)[selectedSectionIndex + 1]];
    setSelectedSection(nextPage);
  };

  const handleSecondaryButtonClick = () => {
    const savingDialogDetails = {
      isOpen: true,
      title: `Save ${complianceItem.name}`,
      description: undefined,
      state: 'Saving compliance item',
      showButtons: false,
    };
    trigger();
    saveComplianceItem(complianceItem);
    return setSavingDialogDetails(savingDialogDetails);
  };

  return (
    <>
      <ModalContent
        bg="adminComplianceItemModal.bg"
        h={["100vh", "calc(100vh - 30px)"]}
        borderRadius={["0", "20px"]}
        position="absolute"
        top={["-60px", "-45px"]}
        right={["0", "15px"]}
      >
        <ModalHeader fontWeight="bold" fontSize="lg" pl="18px">
          {complianceItem.hasOwnProperty('_id') ? 'View' : 'Add'} compliance item
        </ModalHeader>
        <Flex pl="13px" pb="20px">
          <Avatar
            rounded='full'
            name={user?.displayName}
            size='xs'
            src={user?.imgUrl}
            mx={3}
          />
          <Box fontSize="14px" color="brand.darkGrey">{user?.displayName}</Box>
        </Flex>
        <ModalCloseButton onClick={closeModal} />

        <ModalBody p={[1.5, 4]} overflowY='auto'>
          <Accordion index={selectedSectionIndex}>
            {complianceItemModalSections.map(ComplianceItemModalSection)}
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <Button
            w="110px"
            bg="white"
            color="adminComplianceItemModal.secondaryButton.bg"
            fontSize="md"
            fontWeight="700"
            onClick={handleSecondaryButtonClick}
            disabled={(Object.keys(errors).length > 0 || !isActionRequiredToComplete) && complianceItem.published}
          >Save</Button>
          <Spacer />
          <Button
            w="110px"
            bg="adminComplianceItemModal.primaryButton.bg"
            color="white"
            fontSize="md"
            fontWeight="700"
            _hover={{ bg: "adminComplianceItemModal.primaryButton.hoverBg" }}
            onClick={handlePrimaryButtonClick}
            disabled={
              selectedSection.name === 'Summary' &&
              (Object.keys(errors).length > 0 || !isActionRequiredToComplete) &&
              !complianceItem.published
            }
          >
            {selectedSection.name !== 'Summary' ?
              'Next' :
              complianceItem.published ?
                'Unpublish' :
                'Publish'
            }
          </Button>
        </ModalFooter>
      </ModalContent>

      <AlertDialog
        isOpen={savingDialogDetails.isOpen}
        title={savingDialogDetails.title}
        description={savingDialogDetails.description}
        state={savingDialogDetails.state}
        showButtons={savingDialogDetails.showButtons}
        handleYes={savingDialogDetails.action}
        handleNo={() => setSavingDialogDetails(initialDialogDetails)}
        onClose={() => setSavingDialogDetails(initialDialogDetails)}
      />
    </>
  )
};

export default ComplianceItemModal;
