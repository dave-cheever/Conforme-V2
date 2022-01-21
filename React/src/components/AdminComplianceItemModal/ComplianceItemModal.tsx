import React, { useEffect, useMemo } from 'react';
import {
  ModalContent,
  ModalHeader,
  Flex,
  Avatar,
  ModalBody,
  Button,
  useToast,
  Icon,
} from '@chakra-ui/react';

import AlertDialog from '../AlertDialog';
import { toastFailed } from '../../bootstrap/config';
import { initialDialogDetails, useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import { useAppContext } from '../../contexts/AppProvider';
import { Close, OpenMenuArrow, Save } from '../../icons';
import NavigationModal from './NavigationModal';
import useDevice from '../../hooks/useDevice';
import NavigationMobileModal from './NavigationMobileModal';

const ComplianceItemModal = ({ refetch }) => {
  const toast = useToast();
  const device = useDevice();
  const { user } = useAppContext();
  const {
    complianceItem,
    errors, trigger,
    savingDialogDetails, setSavingDialogDetails,
    selectedSection, selectedSectionIndex, selectSection,
    setVisitedTab
  } = useComplianceItemModalContext();
  const {
    saveComplianceItem,
    closeModal,
  } = useComplianceItemModal(refetch);

  useEffect(() => {
    setVisitedTab(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { Component } = selectedSection;

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
        description: "Are you sure you wish to publish this compliance item? It will become available for completion by all relevant business units.",
        state: undefined,
        showButtons: true,
        action: () => saveComplianceItem({
          ...complianceItem,
          published: true,
        }),
      };
      return setSavingDialogDetails(savingDialogDetails);
    }
    selectSection(selectedSectionIndex + 1);
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

  const handlePreviousButtonClick = () => {
    selectSection(selectedSectionIndex - 1);
  }

  const buttonText = useMemo(() => {
    if (selectedSection.name !== "Summary") {
      return "Next Step"
    }

    if (complianceItem.published) {
      return "Unpublish";
    }

    if (complianceItem.hasOwnProperty('_id')) {
      return "Publish compliance item";
    }

    return "Add compliance item";

  }, [complianceItem, selectedSection]);

  return (
    <>
      <ModalContent
        h="100%"
        m="0"
        p={["25px", "35px"]}
        rounded="0"
        bg="complianceItemModal.bg"
        position="absolute"
      >
        <ModalHeader p="0 0 20px 0" fontWeight="bold" fontSize="xxl" alignItems="center">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={["14px", "24px"]}>
              <Avatar
                rounded='full'
                name={user?.displayName}
                size='xs'
                src={user?.imgUrl}
                mr={3}
              />
              {complianceItem.hasOwnProperty('_id') ? 'View' : 'Add'} compliance item
            </Flex>
            <Flex alignItems="center">
              <Button
                leftIcon={<Icon as={Save} stroke="complianceItemModal.saveButton.icon" />}
                w="93px"
                h="40px"
                mr="26px"
                bg="complianceItemModal.saveButton.bg"
                color="complianceItemModal.saveButton.color"
                fontSize="smm"
                fontWeight="700"
                onClick={handleSecondaryButtonClick}
                disabled={(Object.keys(errors).length > 0 || !isActionRequiredToComplete) && complianceItem.published}
              >Save</Button>
              <Close w="15px" h="15px" stroke="complianceItemModal.closeIcon" onClick={closeModal} cursor="pointer" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody h="calc(100% - 175px)" p="0">
          <Flex height="100%" flexDir={["column", "row"]}>
            {device !== "mobile" && <NavigationModal />}
            {device === "mobile" && <NavigationMobileModal />}
            <Flex flexDir="column" w={["full", "440px"]} p="25px" bg="complianceItemModal.tabs.bg" h={["calc(100vh - 180px)", "calc(100vh - 120px)"]} rounded="20px" justifyContent="space-between">
              <Flex height="calc(100% - 60px)" mb="20px">
                <Component />
              </Flex>
              <Flex justifyContent={selectedSection.name !== "Details" ? "space-between": "flex-end"} w="full">
                {selectedSection.name !== "Details" &&
                  <Button
                    w="fit-content"
                    h="40px"
                    leftIcon={<Icon as={OpenMenuArrow} stroke="complianceItemModal.tabs.bottomButton.icon" transform="rotate(90deg)" />}
                    fontSize="smm"
                    fontWeight="700"
                    rounded="10px"
                    bg="complianceItemModal.tabs.bottomButton.bg"
                    color="complianceItemModal.tabs.bottomButton.color"
                    _hover={{ bg: "complianceItemModal.tabs.bottomButton.hover" }}
                    onClick={handlePreviousButtonClick}
                  >
                    Back
                  </Button>}
                <Button
                  ml={3}
                  w="fit-content"
                  h="40px"
                  rightIcon={<Icon as={OpenMenuArrow} stroke="complianceItemModal.tabs.bottomButton.icon" transform="rotate(270deg)" />}
                  bg="complianceItemModal.tabs.bottomButton.bg"
                  color="complianceItemModal.tabs.bottomButton.color"
                  fontSize="smm"
                  fontWeight="700"
                  _hover={{ bg: "complianceItemModal.tabs.bottomButton.hover" }}
                  rounded="10px"
                  onClick={() => {
                    trigger(Object.keys(selectedSection.fields || []) as any);
                    handlePrimaryButtonClick()
                  }}
                  disabled={
                    selectedSection.name === 'Summary' &&
                    (Object.keys(errors).length > 0 || !isActionRequiredToComplete) &&
                    !complianceItem.published
                  }
                >
                  {buttonText}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
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

export const complianceItemModalStyles = {
  complianceItemModal: {
    bg: "#ffffff",
    saveButton: {
      bg: "#F0F2F5",
      color: "#424B50",
      icon: "#818197"
    },
    closeIcon: "#282F36",
    tabs: {
      bg: "#F0F2F5",
      bottomButton: {
        bg: "#462AC4",
        color: "#ffffff",
        icon: "#ffffff",
        hover: "#462AC4"
      }
    }
  }
};
