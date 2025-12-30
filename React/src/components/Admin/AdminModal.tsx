import {
  Box,
  Button,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import pluralize from 'pluralize';

import { AddIcon, Close, SaveIcon, Trashcan } from '../../icons';
import { AdminModalState } from '../../interfaces/IAdminContext';
import useDevice from '../../hooks/useDevice';

interface IAdminModal {
  readonly isOpenModal: boolean;
  readonly modalType: AdminModalState;
  readonly onAction: (modalType?: any) => void;
  readonly collection: string;
  readonly children: JSX.Element | JSX.Element[];
  readonly onAddMore?: () => void;
  readonly deleteButtonText?: string;
  readonly isLoading?: boolean;
  readonly isDeleting?: boolean;
  readonly onDeleteClick?: () => void;
  readonly itemName?: string;
  readonly editButtonText?: string;
  readonly addButtonText?: string;
}

function AdminModal({ isOpenModal, modalType, onAction, collection, children, onAddMore, deleteButtonText = 'Delete', isLoading = false, isDeleting = false, onDeleteClick, itemName, editButtonText, addButtonText }: Readonly<IAdminModal>) {
  const { onClose } = useDisclosure();
  const device = useDevice();
  const { isOpen: isConfirmDeleteOpen, onOpen: onConfirmDeleteOpen, onClose: onConfirmDeleteClose } = useDisclosure();

  const handleConfirmDelete = () => {
    onConfirmDeleteClose();
    onAction('delete');
  };

  const handleDiscard = () => {
    onAction();
  };

  const getModalVariant = (): string => {
    if (modalType === 'delete') {
      return 'deleteModal';
    }
    if (collection) {
      return 'adminModal';
    }
    return 'conformeModal';
  };

  const getDeleteConfirmationMessage = () => {
    const collectionName = collection ? pluralize(collection, 1) : 'item';
    if (itemName) {
      const truncatedItemName = itemName.length > 50 ? `${itemName.substring(0, 50)}...` : itemName;
      return (
        <>Are you sure you want to delete the {collectionName}{' '}
          <Box data-id="013213" as="span" color="#2D3748" fontWeight="bold" title={itemName}>
            {truncatedItemName}
          </Box>? This action cannot be undone.
        </>
      );
    }
    return `Are you sure you want to delete this ${collectionName}? This action cannot be undone.`;
  };

  const getPrimaryButtonIcon = () => {
    if (isLoading && !isDeleting) return undefined;
    if (modalType === 'add') return <AddIcon data-id="013100" h="16px" w="16px" stroke="adminModal.primaryButton.iconColor" />;
    if (modalType === 'edit') return <SaveIcon data-id="013100"  h="16px" w="16px" stroke="adminModal.primaryButton.iconColor" />;
    return undefined;
  };

  return (
    <>
      <Modal
        blockScrollOnMount={false}
        data-id="000301"
        isOpen={isOpenModal}
        onClose={onClose}
        onEsc={handleDiscard}
        size={device === 'desktop' || device === 'tablet' || modalType === 'delete' ? 'lg' : 'full'}
        variant={getModalVariant()}
      >
        <ModalOverlay data-id="000302" />
        {(modalType === 'add' || modalType === 'edit') && (
          <ModalContent bg="adminModal.body.bg" data-id="000303" h="100%" m="0" overflow="hidden" p={0} rounded="0">
            <ModalHeader
              data-id="000304"
              borderBottom="1px solid"
              borderColor="adminModal.modalHeader.borderColor"
              bg="adminModal.modalHeader.bg"
              padding="14px 18px"
              position="relative"
            >
              <Flex alignItems="center" justifyContent="space-between" data-id="000305" position="relative" w="full">
                <Flex data-id="000306" alignItems="center" gap={3}>
                  <Text
                    color="adminModal.modalHeader.titleColor"
                    data-id="000308"
                    fontSize="20px"
                    fontWeight="500"
                    lineHeight="100%"
                  >
                    {modalType === 'edit' ? `Edit ${pluralize(collection, 1)}` : `Add a new ${pluralize(collection, 1)}`}
                  </Text>
                </Flex>

                <Box data-id="013209" as="span" display="flex" alignItems="center" gap="10px">
                  {modalType === 'edit' && (
                    <>
                      <Button
                        data-id="000314"
                        _hover={{
                          bg: 'adminModal.deleteButton.hover.bg',
                          color: 'adminModal.deleteButton.hover.color',
                          border: 'none',
                        }}
                        bg="adminModal.deleteButton.bg"
                        color="adminModal.deleteButton.color"
                        border="1px solid"
                        borderColor="adminModal.deleteButton.border"
                        borderRadius="6px"
                        boxShadow="0px 1px 2px 0px #1A202C14"
                        fontSize="12px"
                        fontWeight="500"
                        letterSpacing="0%"
                        padding="6px 8px"
                        isDisabled={isLoading}
                        isLoading={isDeleting}
                        loadingText="Deleting..."
                        onClick={onDeleteClick || onConfirmDeleteOpen}
                        leftIcon={
                          <Trashcan
                            data-id="013100"
                            _groupHover={{ color: 'adminModal.deleteButton.hover.iconColor' }}
                            w="12px"
                            h="12px"
                            color="adminModal.deleteButton.iconColor"
                          />
                        }
                        role="group"
                      >
                        {deleteButtonText}
                      </Button>

                      <Divider data-id="013210" orientation="vertical" height="30px" />
                    </>
                  )}
                  <Box data-id="000309" _hover={{ opacity: 0.7 }} cursor="pointer" lineHeight="100%">
                    <Close data-id="013098" h="16px" onClick={handleDiscard} stroke="adminModal.closeIcon.color" w="16px" />
                  </Box>
                </Box>
              </Flex>
            </ModalHeader>
            <ModalBody bg="adminModal.body.bg" data-id="000310" p="18px" overflowY="auto">
              {children}
            </ModalBody>
            <Box
              data-id="000400"
              bg="adminModal.modalFooter.bg"
              borderTop="1px solid"
              borderColor="adminModal.modalFooter.borderColor"
              color="adminModal.modalFooter.color"
              p="16px 20px"
            >
              <Flex data-id="000313" gap={3} justify="space-between">
                <Button
                  _hover={{ bg: 'adminModal.discardButton.hover.bg' }}
                  bg="adminModal.discardButton.bg"
                  color="adminModal.discardButton.color"
                  data-id="000401"
                  fontSize="14px"
                  fontWeight="500"
                  isDisabled={isLoading}
                  onClick={handleDiscard}
                  variant="ghost"
                >
                  Discard
                </Button>
                <Flex data-id="000315" gap={3}>
                  {/* Add More Button — only in add mode and if onAddMore exists */}
                  {modalType === 'add' && onAddMore && (
                    <Button
                      _hover={{ bg: 'adminModal.addMoreButton.hover.bg' }}
                      bg="adminModal.addMoreButton.bg"
                      color="adminModal.addMoreButton.color"
                      data-id="000316"
                      fontSize="14px"
                      fontWeight="500"
                      isDisabled={isLoading}
                      onClick={onAddMore}
                    >
                      Add More
                    </Button>
                  )}
                  <Box data-id="013099" as="span">
                    <Button
                      _hover={{ bg: 'adminModal.primaryButton.hover.bg' }}
                      bg="adminModal.primaryButton.bg"
                      color="adminModal.primaryButton.color"
                      data-id="000317"
                      fontSize="14px"
                      fontWeight="500"
                      isDisabled={isLoading}
                      isLoading={isLoading && !isDeleting}
                      onClick={() => onAction(modalType)}
                      leftIcon={getPrimaryButtonIcon()}
                      loadingText={modalType === 'edit' ? 'Saving...' : 'Adding...'}
                      marginLeft="10px"
                      spinner={<Spinner data-id="013101" color="adminModal.primaryButton.spinnerColor" size="sm" />}
                    >
                      {modalType === 'edit' ? (editButtonText || 'Save changes') : (addButtonText || 'Add')}
                    </Button>
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </ModalContent>
        )}
        {modalType === 'delete' && (
          <ModalContent
            bg="adminModal.delete.bg"
            borderRadius={['0', '20px']}
            data-id="000319"
            h={['100vh', 'calc(100vh - 30px)']}
            position="absolute"
            right={['0', '15px']}
            top={['-60px', '-45px']}
          >
            <Flex alignItems="center" data-id="000320" flexDirection="column" h="100%" justifyContent="center">
              <Box color="adminModal.button.color" data-id="000321" fontSize="fontSize.xxl" fontWeight="fontWeights.bold" mb="45px">
                Delete
              </Box>
              <Box color="adminModal.text.color" data-id="000322" textAlign="center" whiteSpace="pre">
                {`All the information will be lost and you will need \n to re-create it from scratch.`}
              </Box>
              <Box data-id="000323" mt="34px">
                <Button
                  _hover={{ backgroundColor: 'adminModal.button.keep.hover' }}
                  bg="adminModal.button.keep.bg"
                  borderRadius="4px"
                  color="adminModal.button.color"
                  data-id="000324"
                  mr="22px"
                  onClick={onAction}
                  p="10px 40px"
                >
                  Keep
                </Button>
                <Button borderRadius="4px" data-id="000325" onClick={() => onAction(modalType)} p="10px 40px">
                  Delete
                </Button>
              </Box>
            </Flex>
          </ModalContent>
        )}
      </Modal>
      <Modal data-id="000326" isCentered isOpen={isConfirmDeleteOpen} onClose={onConfirmDeleteClose}>
        <ModalOverlay data-id="000327" />
        <ModalContent bg="white" borderRadius="12px" boxShadow="lg" data-id="000328" p={6} textAlign="center">
          <Box color="#2D3748" data-id="000329" fontSize="20px" fontWeight="500" mb={4} lineHeight="100%">
            Confirm Delete
          </Box>
          <Box color="#2D3748" data-id="000330" mb={6}>
            {getDeleteConfirmationMessage()}
          </Box>
          <Flex data-id="000331" justify="center">
            <Button
              data-id="000332"
              mr={3}
              onClick={onConfirmDeleteClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              data-id="000333"
              onClick={handleConfirmDelete}
              spinner={<Spinner data-id="013096" color="white" size="sm" />}
            >
              Delete
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default AdminModal;

export const adminModalStyles = {
  adminModal: {
    modalHeader: {
      bg: '#FFFFFF',
      borderColor: '#E2E8F0',
      titleColor: '#2D3748',
    },
    body: {
      bg: '#FFFFFF',
    },
    modalFooter: {
      bg: '#FFFFFF',
      color: '#FFFFFF',
      borderColor: '#CBD5E0',
    },
    deleteButton: {
      bg: 'transparent',
      color: '#2D3748',
      border: '#CBD5E0',
      iconColor: '#D0021B',
      hover: {
        bg: '#E93C44',
        color: '#FFFFFF',
        iconColor: '#FFFFFF',
      },
    },
    primaryButton: {
      bg: '#0068A3',
      color: '#FFFFFF',
      iconColor: '#FFFFFF',
      spinnerColor: '#FFFFFF',
      hover: {
        bg: '#462AC4',
      },
    },
    discardButton: {
      bg: 'transparent',
      color: '#2D3748',
      hover: {
        bg: 'transparent',
      },
    },
    addMoreButton: {
      bg: '#E2E8F0',
      color: '#2D3748',
      hover: {
        bg: '#CBD5E0',
      },
    },
    closeIcon: {
      color: '#2D3748',
      hoverOpacity: 0.7,
    },
    button: {
      bg: '#462AC4',
      hover: '#462AC4',
      keep: {
        bg: '#A2171E',
        hover: '#462AC4',
      },
      remove: {
        bg: '#E93C44',
        color: '#ffffff',
      },
      color: '#ffffff',
    },
    text: {
      color: '#ffffff',
    },
    delete: {
      bg: 'rgba(67, 76, 81, 0.95)',
    },
  },
};
