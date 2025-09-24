import { useState } from 'react';

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

interface IAdminModal {
  isOpenModal: boolean;
  modalType: AdminModalState;
  onAction: (modalType?: any) => void;
  collection: string;
  children: JSX.Element | JSX.Element[];
  onAddMore?: () => void;
}

function AdminModal({ isOpenModal, modalType, onAction, collection, children, onAddMore }: IAdminModal) {
  const { user } = useAppContext();
  const { onClose } = useDisclosure();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const confirmDelete = () => {
    setIsConfirmDeleteOpen(false);
    onAction('delete');
  };

  return (
    <>
      <Modal
        data-id="000301"
        blockScrollOnMount={false}
        isOpen={isOpenModal}
        onClose={onClose}
        onEsc={onAction}
        onOverlayClick={onAction}
        variant={collection ? 'adminModal' : 'conformeModal'}
      >
        <ModalOverlay data-id="000302" />
        {modalType !== 'delete' && (
          <ModalContent data-id="000303" bg="adminModal.content.bg" h="full" my="0" position="absolute" rounded="0">
            <ModalHeader data-id="000304" pl="18px">
              <Flex data-id="000305" alignItems="center" justifyContent="space-between" pt="10px">
                <Flex data-id="000306">
                  <Avatar
                    data-id="000307"
                    mx={3}
                    name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                    rounded="full"
                    size="sm"
                    src={user?.imgUrl}
                  />
                  <Box data-id="000308" fontSize="xxl" fontWeight="bold">
                    {modalType === 'edit' ? `Edit ${pluralize(collection, 1)}` : `Add ${pluralize(collection, 1)}`}
                  </Box>
                </Flex>
                <Close data-id="000309" cursor="pointer" h="15px" onClick={onAction} stroke="adminModal.closeIcon" w="15px" />
              </Flex>
            </ModalHeader>
            <ModalBody data-id="000310" bg="adminModal.body.bg" overflowY="auto">
              <Flex data-id="000311" bgColor="#F0F2F5" borderRadius={['0', '20px']} direction="column" minH="98%" p={25}>
                {children}
                <Spacer data-id="000312" />
                <Flex data-id="000313" flexWrap="wrap" gap={3} justify="space-between" mt={5}>
                  {modalType === 'edit' && (
                    <Button
                      data-id="000314"
                      _hover={{ bg: 'adminModal.button.remove.bg' }}
                      bg="adminModal.button.remove.bg"
                      color="adminModal.button.remove.color"
                      fontSize="smm"
                      fontWeight="bold"
                      onClick={() => setIsConfirmDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  )}

                  <Flex data-id="000315" gap={3}>
                    {/* Add More Button — only in add mode and if onAddMore exists */}
                    {modalType === 'add' && onAddMore && (
                      <Button data-id="000316" bg="gray.300" color="black" fontSize="smm" fontWeight="bold" onClick={onAddMore}>
                        Add More
                      </Button>
                    )}

                    <Button
                      data-id="000317"
                      _hover={{ bg: 'adminModal.button.hover' }}
                      bg="adminModal.button.bg"
                      color="adminModal.button.color"
                      fontSize="smm"
                      fontWeight="bold"
                      onClick={() => onAction(modalType)}
                    >
                      {modalType === 'edit' ? 'Update' : 'Add'}
                      <ChevronRight data-id="000318" ml="5px" />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        )}
        {modalType === 'delete' && (
          <ModalContent
            data-id="000319"
            bg="adminModal.delete.bg"
            borderRadius={['0', '20px']}
            h={['100vh', 'calc(100vh - 30px)']}
            position="absolute"
            right={['0', '15px']}
            top={['-60px', '-45px']}
          >
            <Flex data-id="000320" alignItems="center" flexDirection="column" h="100%" justifyContent="center">
              <Box data-id="000321" color="adminModal.button.color" fontSize="fontSize.xxl" fontWeight="fontWeights.bold" mb="45px">
                Delete
              </Box>
              <Box data-id="000322" color="adminModal.text.color" textAlign="center" whiteSpace="pre">
                {`All the information will be lost and you will need \n to re-create it from scratch.`}
              </Box>
              <Box data-id="000323" mt="34px">
                <Button
                  data-id="000324"
                  _hover={{ backgroundColor: 'adminModal.button.keep.hover' }}
                  bg="adminModal.button.keep.bg"
                  borderRadius="4px"
                  color="adminModal.button.color"
                  mr="22px"
                  onClick={onAction}
                  p="10px 40px"
                >
                  Keep
                </Button>
                <Button data-id="000325" borderRadius="4px" onClick={() => onAction(modalType)} p="10px 40px">
                  Delete
                </Button>
              </Box>
            </Flex>
          </ModalContent>
        )}
      </Modal>
      <Modal data-id="000326" isCentered isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
        <ModalOverlay data-id="000327" />
        <ModalContent data-id="000328" bg="white" borderRadius="12px" boxShadow="lg" p={6} textAlign="center">
          <Box data-id="000329" color="gray.800" fontSize="xl" fontWeight="bold" mb={4}>
            Confirm Delete
          </Box>
          <Box data-id="000330" color="gray.600" mb={6}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Box>
          <Flex data-id="000331" justify="center">
            <Button data-id="000332" colorScheme="gray" mr={3} onClick={() => setIsConfirmDeleteOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button data-id="000333" colorScheme="red" onClick={confirmDelete}>
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
