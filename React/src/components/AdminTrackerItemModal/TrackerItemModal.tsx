import React, { useMemo } from 'react';

import { Avatar, Button, Flex, Icon, ModalBody, ModalContent, ModalHeader, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { toastFailed } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { initialDialogDetails, useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useDevice from '../../hooks/useDevice';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';
import { Close, OpenMenuArrow, Save } from '../../icons';
import AlertDialog from '../AlertDialog';
import NavigationMobileModal from './NavigationMobileModal';
import NavigationModal from './NavigationModal';

function TrackerItemModal({ refetch }) {
  const toast = useToast();
  const device = useDevice();
  const { user } = useAppContext();
  const {
    trackerItem,
    errors,
    trigger,
    savingDialogDetails,
    setSavingDialogDetails,
    selectedSection,
    selectedSectionIndex,
    selectSection,
    isValidating,
  } = useTrackerItemModalContext();
  const { saveTrackerItem, closeModal } = useTrackerItemModal(refetch);
  const { Component } = selectedSection;

  // Boolean summarizing if at least one evidence is experted OR at least one required question is added
  const isActionRequiredToComplete = useMemo(() => {
    // If evidence with no title exists
    if (trackerItem.evidenceItems?.some((evidence) => evidence === '')) return true;

    // If no evidence or no questions
    if ((trackerItem.evidenceItems || []).length === 0 && (trackerItem.questions || []).filter(({ required }) => required)?.length === 0)
      return true;

    return false;
  }, [trackerItem]);

  const handlePrimaryButtonClick = () => {
    if (selectedSection.name === 'Summary') {
      // If user on Summary page
      if (trackerItem.published) {
        // And CI is published
        const savingDialogDetails = {
          isOpen: true,
          title: `Unpublish ${trackerItem.name}`,
          description: `Are you sure you wish to unpublish this ${t('tracker item')}? It will hide all existing responses.`,
          state: undefined,
          showButtons: true,
          action: () =>
            saveTrackerItem({
              ...trackerItem,
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
        title: `Publish ${trackerItem.name}`,
        description: `Are you sure you wish to publish this ${t(
          'tracker item',
        )}? It will become available for completion by all relevant ${pluralize(t('business unit'))}.`,
        state: undefined,
        showButtons: true,
        action: () =>
          saveTrackerItem({
            ...trackerItem,
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
      title: `Save ${trackerItem.name}`,
      description: undefined,
      state: `Saving ${t('tracker item')}`,
      showButtons: false,
    };
    trigger();
    saveTrackerItem(trackerItem);
    return setSavingDialogDetails(savingDialogDetails);
  };

  const handlePreviousButtonClick = () => {
    selectSection(selectedSectionIndex - 1);
  };

  const buttonText = useMemo(() => {
    if (selectedSection.name !== 'Summary') return 'Next Step';

    if (trackerItem.published) return 'Unpublish';

    if (trackerItem.hasOwnProperty('_id')) return `Publish ${t('tracker item')}`;

    return `Add ${t('tracker item')}`;
  }, [trackerItem, selectedSection]);

  return (<>
    <ModalContent
      bg="trackerItemModal.bg"
      data-id="b81317eb7c08"
      h="auto"
      m="0"
      maxH="none"
      minH="100vh"
      minW={['full', '850px']}
      p={['25px', '35px']}
      position="absolute"
      rounded="0">
      <ModalHeader
        alignItems="center"
        data-id="b24c9acd0f16"
        fontSize="xxl"
        fontWeight="bold"
        p="0 0 20px 0">
        <Flex data-id="4d57dcdb0d8a" justifyContent="space-between">
          <Flex alignItems="center" data-id="19b4d523acfe" fontSize={['14px', '24px']}>
            <Avatar
              data-id="6b482dd8a926"
              mr={3}
              name={user?.displayName}
              rounded="full"
              size="xs"
              src={user?.imgUrl} />
            {trackerItem.hasOwnProperty('_id') ? 'View' : 'Add'} {t('tracker item')}
          </Flex>
          <Flex alignItems="center" data-id="6c09b2d53fe2">
            <Button
              bg="trackerItemModal.saveButton.bg"
              color="trackerItemModal.saveButton.color"
              data-id="c6dd499d4ff3"
              disabled={
                (Object.keys(errors).length > 0 ||
                  isActionRequiredToComplete ||
                  trackerItem?.locationsIds?.length === 0 ||
                  trackerItem?.businessUnitsIds?.length === 0) &&
                trackerItem.published
              }
              fontSize="smm"
              fontWeight="700"
              h="40px"
              leftIcon={<Icon
                as={Save}
                data-id="08426d827272"
                stroke="trackerItemModal.saveButton.icon" />}
              mr="26px"
              onClick={handleSecondaryButtonClick}
              w="93px">
              Save
            </Button>
            <Close
              cursor="pointer"
              data-id="522aa2686000"
              h="15px"
              onClick={closeModal}
              stroke="trackerItemModal.closeIcon"
              w="15px" />
          </Flex>
        </Flex>
      </ModalHeader>
      <ModalBody data-id="24f04096faf1" p="0">
        <Flex data-id="44f5797bfaa9" flexDir={['column', 'row']} height="100%">
          {device !== 'mobile' && <NavigationModal data-id="7589f1f350c5" />}
          {device === 'mobile' && <NavigationMobileModal data-id="2e824668cc4f" />}
          <Flex
            bg="trackerItemModal.tabs.bg"
            data-id="734f5e855ea9"
            flexDir="column"
            h={['calc(100vh - 180px)', 'calc(100vh - 120px)']}
            justifyContent="space-between"
            p="25px"
            rounded="20px"
            w={['full', '580px']}>
            <Flex
              data-id="aa6e77c991a3"
              mb="20px"
              minH="calc(100% - 60px)"
              overflowY="auto">
              <Component data-id="49d41e48985c" />
            </Flex>
            <Flex
              data-id="3c0494440235"
              justifyContent={selectedSection.name !== 'Details' ? 'space-between' : 'flex-end'}
              w="full">
              {selectedSection.name !== 'Details' && (
                <Button
                  _hover={{
                    bg: 'trackerItemModal.tabs.bottomButton.hover',
                  }}
                  bg="trackerItemModal.tabs.bottomButton.bg"
                  color="trackerItemModal.tabs.bottomButton.color"
                  data-id="373fe7d33b17"
                  fontSize="smm"
                  fontWeight="700"
                  h="40px"
                  leftIcon={<Icon
                    as={OpenMenuArrow}
                    data-id="407626d43c79"
                    stroke="trackerItemModal.tabs.bottomButton.icon"
                    transform="rotate(90deg)" />}
                  onClick={handlePreviousButtonClick}
                  rounded="10px"
                  w="fit-content">
                  Back
                </Button>
              )}
              <Button
                _hover={{ bg: 'trackerItemModal.tabs.bottomButton.hover' }}
                bg="trackerItemModal.tabs.bottomButton.bg"
                color="trackerItemModal.tabs.bottomButton.color"
                data-id="71e20892796f"
                disabled={
                  (Object.keys(errors).length > 0 ||
                    isActionRequiredToComplete ||
                    trackerItem?.locationsIds?.length === 0 ||
                    trackerItem?.businessUnitsIds?.length === 0 ||
                    isValidating) &&
                  selectedSection.name === 'Summary' &&
                  buttonText !== 'Unpublish'
                }
                fontSize="smm"
                fontWeight="700"
                h="40px"
                ml={3}
                onClick={handlePrimaryButtonClick}
                rightIcon={<Icon
                  as={OpenMenuArrow}
                  data-id="557f37756bd1"
                  stroke="trackerItemModal.tabs.bottomButton.icon"
                  transform="rotate(270deg)" />}
                rounded="10px"
                w="fit-content">
                  {isValidating ? 'Validating...' : buttonText}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </ModalBody>
    </ModalContent>
    <AlertDialog
      data-id="cd740b175ebe"
      description={savingDialogDetails.description}
      handleNo={() => setSavingDialogDetails(initialDialogDetails)}
      handleYes={savingDialogDetails.action}
      isOpen={savingDialogDetails.isOpen}
      onClose={() => setSavingDialogDetails(initialDialogDetails)}
      showButtons={savingDialogDetails.showButtons}
      state={savingDialogDetails.state}
      title={savingDialogDetails.title} />
  </>);
}

export default TrackerItemModal;

export const trackerItemModalStyles = {
  trackerItemModal: {
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
