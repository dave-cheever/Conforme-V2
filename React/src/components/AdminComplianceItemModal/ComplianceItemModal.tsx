import React, { useMemo } from 'react';

import { Avatar, Button, Flex, Icon, ModalBody, ModalContent, ModalHeader, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { toastFailed } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { initialDialogDetails, useComplianceItemModalContext } from '../../contexts/ComplianceItemModalProvider';
import useComplianceItemModal from '../../hooks/useComplianceItemModal';
import useDevice from '../../hooks/useDevice';
import { Close, OpenMenuArrow, Save } from '../../icons';
import AlertDialog from '../AlertDialog';
import NavigationMobileModal from './NavigationMobileModal';
import NavigationModal from './NavigationModal';

const ComplianceItemModal = ({ refetch }) => {
  const toast = useToast();
  const device = useDevice();
  const { user } = useAppContext();
  const {
    complianceItem,
    errors,
    trigger,
    savingDialogDetails,
    setSavingDialogDetails,
    selectedSection,
    selectedSectionIndex,
    selectSection,
  } = useComplianceItemModalContext();
  const { saveComplianceItem, closeModal } = useComplianceItemModal(refetch);
  const { Component } = selectedSection;

  // Boolean summarizing if at least one evidence is experted OR at least one required question is added
  const isActionRequiredToComplete = useMemo(() => {
    // If evidence with no title exists
    if (complianceItem.evidenceItems?.some((evidence) => evidence === '')) return true;

    // If no evidence or no questions
    if (
      (complianceItem.evidenceItems || []).length === 0 &&
      (complianceItem.questions || []).filter(({ required }) => required)?.length === 0
    )
      return true;

    return false;
  }, [complianceItem]);

  const handlePrimaryButtonClick = () => {
    if (selectedSection.name === 'Summary') {
      // If user on Summary page
      if (complianceItem.published) {
        // And CI is published
        const savingDialogDetails = {
          isOpen: true,
          title: `Unpublish ${complianceItem.name}`,
          description: `Are you sure you wish to unpublish this ${t('tracker item')}? It will hide all existing responses.`,
          state: undefined,
          showButtons: true,
          action: () =>
            saveComplianceItem({
              ...complianceItem,
              published: false,
            }),
        };
        return setSavingDialogDetails(savingDialogDetails);
      }
      if (Object.keys(errors).length > 0) {
        // If CI is not published and there are errors
        return toast({
          ...toastFailed,
          description: 'Please complete all the required fields',
        });
      }

      // If CI is not published
      const savingDialogDetails = {
        isOpen: true,
        title: `Publish ${complianceItem.name}`,
        description: `Are you sure you wish to publish this ${t(
          'tracker item',
        )}? It will become available for completion by all relevant ${pluralize(t('business unit'))}.`,
        state: undefined,
        showButtons: true,
        action: () =>
          saveComplianceItem({
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
      state: `Saving ${t('tracker item')}`,
      showButtons: false,
    };
    trigger();
    saveComplianceItem(complianceItem);
    return setSavingDialogDetails(savingDialogDetails);
  };

  const handlePreviousButtonClick = () => {
    selectSection(selectedSectionIndex - 1);
  };

  const buttonText = useMemo(() => {
    if (selectedSection.name !== 'Summary') return 'Next Step';

    if (complianceItem.published) return 'Unpublish';

    if (complianceItem.hasOwnProperty('_id')) return `Publish ${t('tracker item')}`;

    return `Add ${t('tracker item')}`;
  }, [complianceItem, selectedSection]);

  return (
    <>
      <ModalContent bg="complianceItemModal.bg" h="100%" m="0" p={['25px', '35px']} position="absolute" rounded="0">
        <ModalHeader alignItems="center" fontSize="xxl" fontWeight="bold" p="0 0 20px 0">
          <Flex justifyContent="space-between">
            <Flex alignItems="center" fontSize={['14px', '24px']}>
              <Avatar mr={3} name={user?.displayName} rounded="full" size="xs" src={user?.imgUrl} />
              {complianceItem.hasOwnProperty('_id') ? 'View' : 'Add'} {t('tracker item')}
            </Flex>
            <Flex alignItems="center">
              <Button
                bg="complianceItemModal.saveButton.bg"
                color="complianceItemModal.saveButton.color"
                disabled={
                  (Object.keys(errors).length > 0 ||
                    isActionRequiredToComplete ||
                    complianceItem?.locationsIds?.length === 0 ||
                    complianceItem?.businessUnitsIds?.length === 0) &&
                  complianceItem.published
                }
                fontSize="smm"
                fontWeight="700"
                h="40px"
                leftIcon={<Icon as={Save} stroke="complianceItemModal.saveButton.icon" />}
                mr="26px"
                onClick={handleSecondaryButtonClick}
                w="93px"
              >
                Save
              </Button>
              <Close cursor="pointer" h="15px" onClick={closeModal} stroke="complianceItemModal.closeIcon" w="15px" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody p="0">
          <Flex flexDir={['column', 'row']} height="100%">
            {device !== 'mobile' && <NavigationModal />}
            {device === 'mobile' && <NavigationMobileModal />}
            <Flex
              bg="complianceItemModal.tabs.bg"
              flexDir="column"
              h={['calc(100vh - 180px)', 'calc(100vh - 120px)']}
              justifyContent="space-between"
              p="25px"
              rounded="20px"
              w={['full', '440px']}
            >
              <Flex mb="20px" minH="calc(100% - 60px)" overflowY="auto">
                <Component />
              </Flex>
              <Flex justifyContent={selectedSection.name !== 'Details' ? 'space-between' : 'flex-end'} w="full">
                {selectedSection.name !== 'Details' && (
                  <Button
                    _hover={{
                      bg: 'complianceItemModal.tabs.bottomButton.hover',
                    }}
                    bg="complianceItemModal.tabs.bottomButton.bg"
                    color="complianceItemModal.tabs.bottomButton.color"
                    fontSize="smm"
                    fontWeight="700"
                    h="40px"
                    leftIcon={<Icon as={OpenMenuArrow} stroke="complianceItemModal.tabs.bottomButton.icon" transform="rotate(90deg)" />}
                    onClick={handlePreviousButtonClick}
                    rounded="10px"
                    w="fit-content"
                  >
                    Back
                  </Button>
                )}
                <Button
                  _hover={{ bg: 'complianceItemModal.tabs.bottomButton.hover' }}
                  bg="complianceItemModal.tabs.bottomButton.bg"
                  color="complianceItemModal.tabs.bottomButton.color"
                  disabled={
                    (Object.keys(errors).length > 0 ||
                      isActionRequiredToComplete ||
                      complianceItem?.locationsIds?.length === 0 ||
                      complianceItem?.businessUnitsIds?.length === 0) &&
                    selectedSection.name === 'Summary' &&
                    buttonText !== 'Unpublish'
                  }
                  fontSize="smm"
                  fontWeight="700"
                  h="40px"
                  ml={3}
                  onClick={() => {
                    trigger(Object.keys(selectedSection.fields || []) as any);
                    handlePrimaryButtonClick();
                  }}
                  rightIcon={<Icon as={OpenMenuArrow} stroke="complianceItemModal.tabs.bottomButton.icon" transform="rotate(270deg)" />}
                  rounded="10px"
                  w="fit-content"
                >
                  {buttonText}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>

      <AlertDialog
        description={savingDialogDetails.description}
        handleNo={() => setSavingDialogDetails(initialDialogDetails)}
        handleYes={savingDialogDetails.action}
        isOpen={savingDialogDetails.isOpen}
        onClose={() => setSavingDialogDetails(initialDialogDetails)}
        showButtons={savingDialogDetails.showButtons}
        state={savingDialogDetails.state}
        title={savingDialogDetails.title}
      />
    </>
  );
};

export default ComplianceItemModal;

export const complianceItemModalStyles = {
  complianceItemModal: {
    bg: '#ffffff',
    saveButton: {
      bg: '#F0F2F5',
      color: '#424B50',
      icon: '#818197',
    },
    closeIcon: '#282F36',
    tabs: {
      bg: '#F0F2F5',
      bottomButton: {
        bg: '#462AC4',
        color: '#ffffff',
        icon: '#ffffff',
        hover: '#462AC4',
      },
    },
    toggle: {
      color: '#818197',
      label: {
        default: '#818197',
        active: '#282F36',
      },
    },
  },
};
