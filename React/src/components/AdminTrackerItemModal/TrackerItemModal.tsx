import { useMemo } from 'react';

import { Avatar, Button, Flex, Icon, ModalBody, ModalContent, ModalHeader, useToast } from '@chakra-ui/react';
import { t } from 'i18next';
import pluralize from 'pluralize';

import { toastFailed } from '../../bootstrap/config';
import { useAppContext } from '../../contexts/AppProvider';
import { initialDialogDetails, useTrackerItemModalContext } from '../../contexts/TrackerItemModalProvider';
import useDevice from '../../hooks/useDevice';
import useNavigate from '../../hooks/useNavigate';
import useTrackerItemModal from '../../hooks/useTrackerItemModal';
import { Close, OpenMenuArrow, Save } from '../../icons';
import AlertDialog from '../AlertDialog';
import NavigationMobileModal from './NavigationMobileModal';
import NavigationModal from './NavigationModal';

function TrackerItemModal({ refetch, onItemAdded }) {
  const toast = useToast();
  const device = useDevice();
  const {navigateTo } = useNavigate();
  const { reset } = useTrackerItemModalContext();
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
          action: async () => {
          const id =   await saveTrackerItem({
              ...trackerItem,
              published: false,
            });
            
            navigateTo(`/tracker-item/${id}`);
            if (onItemAdded) onItemAdded();
            closeModal();
          },
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
        action: async () => {
        const id=  await saveTrackerItem({
            ...trackerItem,
            published: true,
          });

          navigateTo(`/tracker-item/${id}`);
           if (onItemAdded) onItemAdded();
          closeModal();
        },
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
    if (onItemAdded) onItemAdded();
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

  const handleAddMoreButtonClick = async () => {
    try {
      await saveTrackerItem(trackerItem);
      if (onItemAdded) onItemAdded();
      reset();
    } catch (error: any) {
      toast({
        ...toastFailed,
        description:'An error occurred while saving the tracker item',
      });
    }
  };

  return (
    <>
      <ModalContent
        bg="trackerItemModal.bg"
        data-id="000694"
        h="auto"
        m="0"
        maxH="none"
        minH="100vh"
        minW={['full', '850px']}
        p={['25px', '35px']}
        position="absolute"
        rounded="0"
      >
        <ModalHeader alignItems="center" data-id="000695" fontSize="xxl" fontWeight="bold" p="0 0 20px 0">
          <Flex data-id="000696" justifyContent="space-between">
            <Flex alignItems="center" data-id="000697" fontSize={['16px', '24px']}>
              <Avatar
                data-id="000698"
                mr={3}
                name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                rounded="full"
                size="xs"
                src={user?.imgUrl}
              />
              {trackerItem.hasOwnProperty('_id') ? 'View' : 'Add'} {t('tracker item')}
            </Flex>
            <Flex alignItems="center" data-id="000699">
              <Button
                bg="trackerItemModal.saveButton.bg"
                color="trackerItemModal.saveButton.color"
                data-id="000700"
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
                leftIcon={<Icon as={Save} data-id="000701" stroke="trackerItemModal.saveButton.icon" />}
                mr="26px"
                onClick={handleSecondaryButtonClick}
                w="93px"
              >
                Save
              </Button>
              <Close cursor="pointer" data-id="000702" h="15px" onClick={closeModal} stroke="trackerItemModal.closeIcon" w="15px" />
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody data-id="000703" p="0">
          <Flex data-id="000704" flexDir={['column', 'row']} height="100%">
            {device !== 'mobile' && <NavigationModal data-id="000705" />}
            {device === 'mobile' && <NavigationMobileModal data-id="000706" />}
            <Flex
              bg="trackerItemModal.tabs.bg"
              data-id="000707"
              flexDir="column"
              h={['calc(100vh - 180px)', 'calc(100vh - 120px)']}
              justifyContent="space-between"
              p={["14px", "25px"]}
              rounded="20px"
              w={['full', '580px']}
            >
              <Flex data-id="000708" mb="20px" minH="calc(100% - 60px)" overflowY="auto">
                <Component data-id="000709" />
              </Flex>
              <Flex data-id="000710" justifyContent="space-between" w="full">
                {selectedSection.name !== 'Details' && (
                  <Button
                    bg="trackerItemModal.tabs.bottomButton.bg"
                    color="trackerItemModal.tabs.bottomButton.color"
                    data-id="000711"
                    fontSize={["12px", "14px"]}
                    fontWeight="700"
                    h="40px"
                    leftIcon={<Icon
                      as={OpenMenuArrow}
                      data-id="000712"
                      stroke="#ffffff"
                      transform="rotate(90deg)" />}
                    onClick={handlePreviousButtonClick}
                    rounded="10px"
                    w={["40px", "fit-content"]}>
                    {device !== "mobile" ? "Back ": ""}
                  </Button>
                )}

                <Flex data-id="000713" gap={3}>
                  {selectedSection.name === 'Summary' && !trackerItem._id && (
                    <Button
                      bg="gray.300"
                      color="black"
                      data-id="000714"
                      disabled={
                        Object.keys(errors).length > 0 ||
                        isActionRequiredToComplete ||
                        trackerItem?.locationsIds?.length === 0 ||
                        trackerItem?.businessUnitsIds?.length === 0
                      }
                      fontSize={["12px", "14px"]}
                      fontWeight="700"
                      h="40px"
                      onClick={handleAddMoreButtonClick}
                      rounded="10px"
                      w="fit-content">
                      Add More
                    </Button>
                  )}

                  <Button
                    _hover={{ bg: 'trackerItemModal.tabs.bottomButton.hover' }}
                    bg="trackerItemModal.tabs.bottomButton.bg"
                    color="trackerItemModal.tabs.bottomButton.color"
                    data-id="000715"
                    fontSize={["12px", "14px"]}
                    fontWeight="700"
                    h="40px"
                    onClick={handlePrimaryButtonClick}
                    rightIcon={<Icon
                      as={OpenMenuArrow}
                      data-id="000716"
                      stroke="#ffffff"
                      transform="rotate(270deg)" />}
                    rounded="10px"
                    w="fit-content">
                    {isValidating ? 'Validating...' : buttonText}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
      <AlertDialog
        data-id="000717"
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
