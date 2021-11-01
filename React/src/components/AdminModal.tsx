import {
  Box,
  Avatar,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from "@chakra-ui/react";
import { useAppContext } from '../contexts/AppProvider';
import { AdminModalState } from '../interfaces/IAdminContext';

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
    <Modal isOpen={isOpenModal} onClose={onClose} size={"lg"} onOverlayClick={onAction} onEsc={onAction}>
      <ModalOverlay />
      {modalType !== "delete" &&
        <ModalContent
          bg="brand.lightGrey"
          h={["100vh", "calc(100vh - 30px)"]}
          borderRadius={["0", "20px"]}
          position="absolute"
          top={["-60px", "-45px"]}
          right={["0", "15px"]}
        >
          <ModalHeader fontWeight="bold" fontSize="lg" pl="18px">{modalType === "edit" ? `Edit ${collection}` : `Add ${collection}`}</ModalHeader>
          <Flex pl="13px" pb="20px">
            <Avatar
              borderColor='brand.active'
              rounded='full' name={user?.displayName}
              size='xs'
              src={user?.imgUrl}
              mx={3}
            />
            <Box fontSize="14px" color="brand.darkGrey">{user?.displayName}</Box>
          </Flex>
          <ModalCloseButton onClick={onAction} />
          <ModalBody bg="white" overflowY='auto'>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button
              w="110px"
              bg="brand.addButton"
              color="white"
              fontSize="brand.primaryFont"
              fontWeight="700"
              _hover={{ bg: "#E6555C" }}
              onClick={() => onAction(modalType)}
            >
              {modalType === "edit" ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>}
      {modalType === "delete" &&
        <ModalContent
          bg="rgba(67, 76, 81, 0.95)"
          h={["100vh", "calc(100vh - 30px)"]}
          borderRadius={["0", "20px"]}
          position="absolute"
          top={["-60px", "-45px"]}
          right={["0", "15px"]}
        >
          <Flex h="100%" alignItems="center" flexDirection="column" justifyContent="center">
            <Box fontSize="xxl" fontWeight="bold" color="white" mb="45px">Remove</Box>
            <Box
              whiteSpace="pre"
              color="white"
              textAlign="center"
            >
              {`All the information will be lost and you will need \n to re-create it from scratch.`}
            </Box>
            <Box mt="34px">
              <Button
                color="white"
                p="10px 40px"
                bg="brand.primary"
                borderRadius="4px"
                mr="22px"
                onClick={onAction}
              >Keep</Button>
              <Button p="10px 40px" borderRadius="4px" onClick={() => onAction(modalType)}>Remove</Button>
            </Box>
          </Flex>
        </ModalContent>}
    </Modal>
  )
}

export default AdminModal;
