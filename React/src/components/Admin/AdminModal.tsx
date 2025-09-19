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
        blockScrollOnMount={false}
        data-id="030925-b3aa19"
        isOpen={isOpenModal}
        onClose={onClose}
        onEsc={onAction}
        onOverlayClick={onAction}
        variant={collection ? 'adminModal' : 'conformeModal'}
      >
        <ModalOverlay data-id="030925-4ff34f" />
        {modalType !== 'delete' && (
          <ModalContent bg="adminModal.content.bg" data-id="030925-7a2f88" h="full" my="0" position="absolute" rounded="0">
            <ModalHeader data-id="030925-719c4d" pl="18px">
              <Flex alignItems="center" data-id="030925-47a2c4" justifyContent="space-between" pt="10px">
                <Flex data-id="030925-7ebcfd">
                  <Avatar
                    data-id="030925-1470cf"
                    mx={3}
                    name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                    rounded="full"
                    size="sm"
                    src={user?.imgUrl}
                  />
                  <Box data-id="030925-c1faec" fontSize="xxl" fontWeight="bold">
                    {modalType === 'edit' ? `Edit ${pluralize(collection, 1)}` : `Add ${pluralize(collection, 1)}`}
                  </Box>
                </Flex>
                <Close cursor="pointer" data-id="030925-c4342f" h="15px" onClick={onAction} stroke="adminModal.closeIcon" w="15px" />
              </Flex>
            </ModalHeader>
            <ModalBody bg="adminModal.body.bg" data-id="030925-54ce6d" overflowY="auto">
              <Flex bgColor="#F0F2F5" borderRadius={['0', '20px']} data-id="030925-1efcbd" direction="column" minH="98%" p={25}>
                {children}
                <Spacer data-id="030925-10383d" />
                <Flex data-id="030925-35c3a9" flexWrap="wrap" gap={3} justify="space-between" mt={5}>
                  {modalType === 'edit' && (
                    <Button
                      _hover={{ bg: 'adminModal.button.remove.bg' }}
                      bg="adminModal.button.remove.bg"
                      color="adminModal.button.remove.color"
                      data-id="030925-dd7421"
                      fontSize="smm"
                      fontWeight="bold"
                      onClick={() => setIsConfirmDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  )}

                  <Flex data-id="030925-177b3c" gap={3}>
                    {/* Add More Button — only in add mode and if onAddMore exists */}
                    {modalType === 'add' && onAddMore && (
                      <Button bg="gray.300" color="black" data-id="030925-33b1f9" fontSize="smm" fontWeight="bold" onClick={onAddMore}>
                        Add More
                      </Button>
                    )}

                    <Button
                      _hover={{ bg: 'adminModal.button.hover' }}
                      bg="adminModal.button.bg"
                      color="adminModal.button.color"
                      data-id="030925-9a4314"
                      fontSize="smm"
                      fontWeight="bold"
                      onClick={() => onAction(modalType)}
                    >
                      {modalType === 'edit' ? 'Update' : 'Add'}
                      <ChevronRight data-id="030925-a7ce07" ml="5px" />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </ModalBody>
          </ModalContent>
        )}
        {modalType === 'delete' && (
          <ModalContent
            bg="adminModal.delete.bg"
            borderRadius={['0', '20px']}
            data-id="030925-8d1265"
            h={['100vh', 'calc(100vh - 30px)']}
            position="absolute"
            right={['0', '15px']}
            top={['-60px', '-45px']}
          >
            <Flex alignItems="center" data-id="030925-dd7747" flexDirection="column" h="100%" justifyContent="center">
              <Box color="adminModal.button.color" data-id="030925-7786e0" fontSize="fontSize.xxl" fontWeight="fontWeights.bold" mb="45px">
                Delete
              </Box>
              <Box color="adminModal.text.color" data-id="030925-16cf54" textAlign="center" whiteSpace="pre">
                {`All the information will be lost and you will need \n to re-create it from scratch.`}
              </Box>
              <Box data-id="030925-869b13" mt="34px">
                <Button
                  _hover={{ backgroundColor: 'adminModal.button.keep.hover' }}
                  bg="adminModal.button.keep.bg"
                  borderRadius="4px"
                  color="adminModal.button.color"
                  data-id="030925-8b750e"
                  mr="22px"
                  onClick={onAction}
                  p="10px 40px"
                >
                  Keep
                </Button>
                <Button borderRadius="4px" data-id="030925-8d0b38" onClick={() => onAction(modalType)} p="10px 40px">
                  Delete
                </Button>
              </Box>
            </Flex>
          </ModalContent>
        )}
      </Modal>
      <Modal data-id="030925-fbed58" isCentered isOpen={isConfirmDeleteOpen} onClose={() => setIsConfirmDeleteOpen(false)}>
        <ModalOverlay data-id="030925-615de7" />
        <ModalContent bg="white" borderRadius="12px" boxShadow="lg" data-id="030925-92d46c" p={6} textAlign="center">
          <Box color="gray.800" data-id="030925-f7d2e2" fontSize="xl" fontWeight="bold" mb={4}>
            Confirm Delete
          </Box>
          <Box color="gray.600" data-id="030925-3c84cf" mb={6}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Box>
          <Flex data-id="030925-bb5d4a" justify="center">
            <Button colorScheme="gray" data-id="030925-6147c4" mr={3} onClick={() => setIsConfirmDeleteOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button colorScheme="red" data-id="030925-4a5d04" onClick={confirmDelete}>
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
