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
  useDisclosure,
} from "@chakra-ui/react";
import { useAppContext } from "../contexts/AppProvider";
import { AdminModalState } from "../interfaces/IAdminContext";

interface IAdminModal {
  isOpenModal: boolean;
  modalType: AdminModalState;
  onAction: (modalType?: any) => void;
  collection: string;
  children: JSX.Element | JSX.Element[];
}

const AdminModal = ({
  isOpenModal,
  modalType,
  onAction,
  collection,
  children,
}: IAdminModal) => {
  const { user } = useAppContext();
  const { onClose } = useDisclosure();

  return (
    <Modal
      isOpen={isOpenModal}
      onClose={onClose}
      size={"lg"}
      onOverlayClick={onAction}
      onEsc={onAction}
      variant="conformeModal"
    >
      <ModalOverlay />
      {modalType !== "delete" && (
        <ModalContent
          bg="adminModal.content.bg"
          h={["100vh", "calc(100vh - 30px)"]}
          borderRadius={["0", "20px"]}
          position="absolute"
          top={["-60px", "-45px"]}
          right={["0", "15px"]}
        >
          <ModalHeader
            fontWeight="fontWeights.bold"
            fontSize="fontSizes.lg"
            pl="18px"
          >
            {modalType === "edit" ? `Edit ${collection}` : `Add ${collection}`}
          </ModalHeader>
          <Flex pl="13px" pb="20px">
            <Avatar
              rounded="full"
              name={user?.displayName}
              size="xs"
              src={user?.imgUrl}
              mx={3}
            />
            <Box fontSize="fontSizes.smm">{user?.displayName}</Box>
          </Flex>
          <ModalCloseButton onClick={onAction} />
          <ModalBody bg="adminModal.body.bg" overflowY="auto">
            {children}
          </ModalBody>
          <ModalFooter>
            <Button
              w="110px"
              bg="adminModal.button.bg"
              color="adminModal.button.color"
              fontSize="font.md"
              fontWeight="fontWeights.bold"
              _hover={{ bg: "adminModal.button.hover" }}
              onClick={() => onAction(modalType)}
            >
              {modalType === "edit" ? "Update" : "Add"}
            </Button>
          </ModalFooter>
        </ModalContent>
      )}
      {modalType === "delete" && (
        <ModalContent
          bg="adminModal.delete.bg"
          h={["100vh", "calc(100vh - 30px)"]}
          borderRadius={["0", "20px"]}
          position="absolute"
          top={["-60px", "-45px"]}
          right={["0", "15px"]}
        >
          <Flex
            h="100%"
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
          >
            <Box
              fontSize="fontSize.xxl"
              fontWeight="fontWeights.bold"
              color="adminModal.button.color"
              mb="45px"
            >
              Remove
            </Box>
            <Box
              whiteSpace="pre"
              color="adminModal.text.color"
              textAlign="center"
            >
              {`All the information will be lost and you will need \n to re-create it from scratch.`}
            </Box>
            <Box mt="34px">
              <Button
                color="adminModal.button.color"
                p="10px 40px"
                bg="adminModal.button.keep.bg"
                _hover={{ backgroundColor: "adminModal.button.keep.hover" }}
                borderRadius="4px"
                mr="22px"
                onClick={onAction}
              >
                Keep
              </Button>
              <Button
                p="10px 40px"
                borderRadius="4px"
                onClick={() => onAction(modalType)}
              >
                Remove
              </Button>
            </Box>
          </Flex>
        </ModalContent>
      )}
    </Modal>
  );
};

export default AdminModal;
