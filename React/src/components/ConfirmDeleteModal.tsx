import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Spinner, Text } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { Trashcan } from '../icons';

interface IConfirmDeleteModal {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly itemName?: string;
  readonly collectionName?: string;
  readonly isLoading?: boolean;
  readonly confirmButtonText?: string;
  readonly cancelButtonText?: string;
  readonly title?: string;
  readonly message?: React.ReactNode;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  collectionName = 'item',
  isLoading = false,
  confirmButtonText = 'Delete',
  cancelButtonText = 'Discard',
  title = 'Delete',
  message,
}: Readonly<IConfirmDeleteModal>) => {
  const getTruncatedItemName = () => {
    if (!itemName) return '';
    return itemName.length > 45 ? `${itemName.substring(0, 45)}...` : itemName;
  };

  const getDeleteConfirmationMessage = () => {
    const singularCollectionName = collectionName ? pluralize(collectionName, 1) : 'item';
    if (itemName) {
      const truncatedItemName = getTruncatedItemName();
      return `Are you sure you want to delete the ${singularCollectionName} "${truncatedItemName}"`;
    }
    return `Are you sure you want to delete this ${singularCollectionName}`;
  };

  const getModalTitle = () => {
    if (itemName) {
      const truncatedItemName = getTruncatedItemName();
      return `${title} "${truncatedItemName}"`;
    }
    return title;
  };

  return (
    <Modal data-id="000326" closeOnOverlayClick={true} isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay data-id="000327" />
      <ModalContent
        bg="confirmDeleteModal.bg"
        borderRadius="12px"
        boxShadow="lg"
        data-id="000328"
        maxW={['calc(100% - 32px)', '640px']}
        mx={[4, 'auto']}
      >
        <ModalHeader data-id="000329" display="flex" justifyContent="space-between" alignItems="center" padding="14px 20px" borderBottom="1px solid #CBD5E0" position="relative" gap="8px">
          <Text data-id="000329" color="confirmDeleteModal.title.color" fontSize={['16px', '20px']} fontWeight="600" lineHeight="100%" flex="1">
            {getModalTitle()}
          </Text>
          <ModalCloseButton data-id="000329" position="relative" top="0" right="0" transform="none" />
        </ModalHeader>
        <ModalBody data-id="000330" padding="16px 20px">
          <Text data-id="000330" color="confirmDeleteModal.message.color" fontSize={['14px', '16px']} fontWeight="400" lineHeight="100%">{getDeleteConfirmationMessage()}</Text>
          <Spacer data-id="013217" height="12px" />
          <Text data-id="000330" color="confirmDeleteModal.message.color" fontSize={['14px', '16px']} fontWeight="400" lineHeight="100%">This action cannot be undone. {message}</Text>
        </ModalBody>
        <ModalFooter data-id="000331" padding="16px 20px" display="flex" justifyContent="space-between" alignItems="center" borderTop="1px solid #CBD5E0">
          <Button
            _hover={{ bg: 'confirmDeleteModal.cancelButton.hover.bg' }}
            bg="confirmDeleteModal.cancelButton.bg"
            color="confirmDeleteModal.cancelButton.color"
            data-id="000332"
            isDisabled={isLoading}
            onClick={onClose}
            variant="ghost"
            fontSize="14px"
            fontWeight="500"
            lineHeight="100%"
          >
            {cancelButtonText}
          </Button>
          <Button
            _hover={{
              bg: 'confirmDeleteModal.confirmButton.hover.bg',
              color: 'confirmDeleteModal.confirmButton.hover.color',
              border: "1px solid #D0021B",
            }}

            bg="confirmDeleteModal.confirmButton.bg"
            borderColor="confirmDeleteModal.confirmButton.bg"
            borderWidth="1px"
            color="confirmDeleteModal.confirmButton.color"
            data-id="000333"
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={onConfirm}
            spinner={<Spinner data-id="013096" color="confirmDeleteModal.confirmButton.spinnerColor" size="sm" />}
            fontSize="14px"
            fontWeight="500"
            lineHeight="100%"
            px="12px"
            height="34px"
            borderRadius="6px"
            transition="all 0.2s ease-in-out"
            leftIcon={<Trashcan
              data-id="013218"
              w="16px"
              h="16px"
              stroke="confirmDeleteModal.confirmButton.iconColor" />}
          >
            {confirmButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export const confirmDeleteModalStyles = {
  confirmDeleteModal: {
    bg: '#FFFFFF',
    title: {
      color: '#1A202C',
    },
    message: {
      color: '#4A5568',
    },
    itemName: {
      color: '#2D3748',
    },
    cancelButton: {
      bg: 'transparent',
      color: '#2D3748',
      hover: {
        bg: 'transparent',
      },
    },
    confirmButton: {
      bg: '#D0021B',
      color: '#FFFFFF',
      spinnerColor: '#FFFFFF',
      iconColor: '#FFFFFF',
      hover: {
        bg: '#FFFFFF',
        borderColor: '#D0021B',
        color: '#D0021B',
        iconColor: '#D0021B',
      },
    },
  },
};
