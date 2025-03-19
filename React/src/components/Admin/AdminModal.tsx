import {
  Avatar,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
} from '@chakra-ui/react';
import pluralize from 'pluralize';

import { useAppContext } from '../../contexts/AppProvider';
import { ChevronRight, Close } from '../../icons';
import { AdminModalState } from '../../interfaces/IAdminContext';
import { useState } from 'react';

interface IAdminModal {
  isOpenModal: boolean;
  modalType: AdminModalState;
  onAction: (modalType?: any) => void;
  collection: string;
  children: JSX.Element | JSX.Element[];
}

function AdminModal({ isOpenModal, modalType, onAction, collection, children }: IAdminModal) {
  const { user } = useAppContext();
  const { onClose } = useDisclosure();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const handleDeleteClick = () => {
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    setIsConfirmDeleteOpen(false);
    onAction('delete');
  };


  return (
    (<><Modal
      data-id="90fc313a4d62"
      isOpen={isOpenModal}
      onClose={onClose}
      onEsc={onAction}
      onOverlayClick={onAction}
      variant={collection ? 'adminModal' : 'conformeModal'}>
      <ModalOverlay data-id="1e71a5660fe7" />
      {modalType !== 'delete' && (
        <ModalContent
          bg="adminModal.content.bg"
          data-id="19932c9ae9d7"
          h="full"
          my="0"
          position="absolute"
          rounded="0">
          <ModalHeader data-id="15ae965f65c3" pl="18px">
            <Flex
              alignItems="center"
              data-id="501f4aba6cf7"
              justifyContent="space-between"
              pt="10px">
              <Flex data-id="621ce104c0f0">
                <Avatar
                  data-id="3cf29549c1a0"
                  mx={3}
                  name={user?.displayName}
                  rounded="full"
                  size="sm"
                  src={user?.imgUrl} />
                <Box data-id="bcd5fb2ca122" fontSize="xxl" fontWeight="bold">
                  {modalType === 'edit' ? `Edit ${pluralize(collection, 1)}` : `Add ${pluralize(collection, 1)}`}
                </Box>
              </Flex>
              <Close
                cursor="pointer"
                data-id="e7ed296604c8"
                h="15px"
                onClick={onAction}
                stroke="adminModal.closeIcon"
                w="15px" />
            </Flex>
          </ModalHeader>
          <ModalBody bg="adminModal.body.bg" data-id="b454e1c6deaa" overflowY="auto">
            <Flex
              bgColor="#F0F2F5"
              borderRadius={['0', '20px']}
              data-id="624aea1fdc69"
              direction="column"
              minH="98%"
              p={25}>
              {children}
              <Spacer data-id="96ffd27de89f" />
              <Flex data-id="ad3ed1713194" justify="space-between" mt={5}>
                {modalType === 'edit' && (
                  <Button
                    _hover={{ bg: 'adminModal.button.remove.bg' }}
                    bg="adminModal.button.remove.bg"
                    color="adminModal.button.remove.color"
                    data-id="0270011e535a"
                    fontSize="smm"
                    fontWeight="bold"
                    onClick={() => setIsConfirmDeleteOpen(true)}>
                    Delete
                  </Button>
                )}
                <Button
                  _hover={{ bg: 'adminModal.button.hover' }}
                  bg="adminModal.button.bg"
                  color="adminModal.button.color"
                  data-id="6eb5b4465298"
                  fontSize="smm"
                  fontWeight="bold"
                  onClick={() => onAction(modalType)}>
                  {modalType === 'edit' ? 'Update' : 'Add'}
                  <ChevronRight data-id="9f3b554adde2" ml="5px" />
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      )}
      {modalType === 'delete' && (
        <ModalContent
          bg="adminModal.delete.bg"
          borderRadius={['0', '20px']}
          data-id="080dcb9cd693"
          h={['100vh', 'calc(100vh - 30px)']}
          position="absolute"
          right={['0', '15px']}
          top={['-60px', '-45px']}>
          <Flex
            alignItems="center"
            data-id="46d77f422859"
            flexDirection="column"
            h="100%"
            justifyContent="center">
            <Box
              color="adminModal.button.color"
              data-id="e9ab3cc4d26b"
              fontSize="fontSize.xxl"
              fontWeight="fontWeights.bold"
              mb="45px">
              Delete
            </Box>
            <Box
              color="adminModal.text.color"
              data-id="62a8897bbaf6"
              textAlign="center"
              whiteSpace="pre">
              {`All the information will be lost and you will need \n to re-create it from scratch.`}
            </Box>
            <Box data-id="1c23e491994e" mt="34px">
              <Button
                _hover={{ backgroundColor: 'adminModal.button.keep.hover' }}
                bg="adminModal.button.keep.bg"
                borderRadius="4px"
                color="adminModal.button.color"
                data-id="67ba33adc9e5"
                mr="22px"
                onClick={onAction}
                p="10px 40px">
                Keep
              </Button>
              <Button
                borderRadius="4px"
                data-id="e228c143ae53"
                onClick={() => onAction(modalType)}
                p="10px 40px">
                Delete
              </Button>
            </Box>
          </Flex>
        </ModalContent>
      )}
    </Modal>
      <Modal isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent bg="white" borderRadius="12px" p={6} textAlign="center" boxShadow="lg">
          <Box fontSize="xl" fontWeight="bold" mb={4} color="gray.800">
            Confirm Delete
          </Box>
          <Box color="gray.600" mb={6}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Box>
          <Flex justify="center">
            <Button variant="outline" colorScheme="gray" mr={3} onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Delete
            </Button>
          </Flex>
        </ModalContent>
      </Modal>

    </>)
  );
}

export default AdminModal;

export const adminModalStyles = {
  adminModal: {
    content: {
      bg: '#FFFFFF',
    },
    body: {
      bg: '#FFFFFF',
    },
    closeIcon: '#282F36',
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
