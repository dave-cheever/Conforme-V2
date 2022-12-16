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
}

const AdminModal = ({ isOpenModal, modalType, onAction, collection, children }: IAdminModal) => {
  const { user } = useAppContext();
  const { onClose } = useDisclosure();

  return (
    <Modal
      isOpen={isOpenModal}
      onClose={onClose}
      onEsc={onAction}
      onOverlayClick={onAction}
      variant={collection ? 'adminModal' : 'conformeModal'}
    >
      <ModalOverlay />
      {modalType !== 'delete' && (
        <ModalContent bg="adminModal.content.bg" h="full" my="0" position="absolute" rounded="0">
          <ModalHeader pl="18px">
            <Flex alignItems="center" justifyContent="space-between" pt="10px">
              <Flex>
                <Avatar mx={3} name={user?.displayName} rounded="full" size="sm" src={user?.imgUrl} />
                <Box fontSize="xxl" fontWeight="bold">
                  {modalType === 'edit' ? `Edit ${pluralize(collection, 1)}` : `Add ${pluralize(collection, 1)}`}
                </Box>
              </Flex>
              <Close cursor="pointer" h="15px" onClick={onAction} stroke="adminModal.closeIcon" w="15px" />
            </Flex>
          </ModalHeader>
          <ModalBody bg="adminModal.body.bg" overflowY="auto">
            <Flex bgColor="#F0F2F5" borderRadius={['0', '20px']} direction="column" minH="98%" p={25}>
              {children}
              <Spacer />
              <Flex justify="space-between" mt={5}>
                {modalType === 'edit' && (
                  <Button
                    _hover={{ bg: 'adminModal.button.remove.bg' }}
                    bg="adminModal.button.remove.bg"
                    color="adminModal.button.remove.color"
                    fontSize="smm"
                    fontWeight="bold"
                    onClick={() => onAction('delete')}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  _hover={{ bg: 'adminModal.button.hover' }}
                  bg="adminModal.button.bg"
                  color="adminModal.button.color"
                  fontSize="smm"
                  fontWeight="bold"
                  onClick={() => onAction(modalType)}
                >
                  {modalType === 'edit' ? 'Update' : 'Add'}
                  <ChevronRight ml="5px" />
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
          h={['100vh', 'calc(100vh - 30px)']}
          position="absolute"
          right={['0', '15px']}
          top={['-60px', '-45px']}
        >
          <Flex alignItems="center" flexDirection="column" h="100%" justifyContent="center">
            <Box color="adminModal.button.color" fontSize="fontSize.xxl" fontWeight="fontWeights.bold" mb="45px">
              Delete
            </Box>
            <Box color="adminModal.text.color" textAlign="center" whiteSpace="pre">
              {`All the information will be lost and you will need \n to re-create it from scratch.`}
            </Box>
            <Box mt="34px">
              <Button
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
              <Button borderRadius="4px" onClick={() => onAction(modalType)} p="10px 40px">
                Delete
              </Button>
            </Box>
          </Flex>
        </ModalContent>
      )}
    </Modal>
  );
};

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
