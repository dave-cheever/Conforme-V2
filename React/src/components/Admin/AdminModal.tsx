import {
  Box,
  Avatar,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";

import { useAppContext } from "../../contexts/AppProvider";
import { ChevronRight, Close } from "../../icons";
import { AdminModalState } from "../../interfaces/IAdminContext";

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
      size="xl"
      onOverlayClick={onAction}
      onEsc={onAction}
      variant="conformeModal"
    >
      <ModalOverlay />
      {modalType !== "delete" && (
        <ModalContent
          bg="adminModal.content.bg"
          h={["100vh"]}
          position="absolute"
          top={["-60px"]}
          rounded="0"
        >
          <ModalHeader
            pl="18px"
          >
            <Flex pt="10px" justifyContent="space-between" alignItems="center">
              <Flex>
                <Avatar
                  rounded="full"
                  name={user?.displayName}
                  size="sm"
                  src={user?.imgUrl}
                  mx={3}
                />
                <Box fontSize="xxl" fontWeight="bold" >{modalType === "edit" ? `Edit ${collection}` : `Add ${collection}`}</Box>
              </Flex>
              <Close w="15px" h="15px" stroke="adminModal.closeIcon" onClick={onAction} cursor="pointer" />
            </Flex>
          </ModalHeader>
          <ModalBody bg="adminModal.body.bg" overflowY="auto">
            <Box borderRadius={["0", "20px"]} bgColor="#F0F2F5" h={"98%"} p={25} position="relative" >
              {children}


              {(modalType === 'edit') &&
                <Button
                  mb="25"
                  bottom={0}
                  position="absolute"
                  bg="adminModal.button.remove.bg"
                  color="adminModal.button.remove.color"
                  _hover={{ bg: "adminModal.button.remove.bg" }}
                  fontSize="smm"
                  fontWeight="bold"
                  onClick={() => onAction("delete")}
                >
                  Remove
                </Button>}
              <Button
                mb="25"
                right={modalType === 'edit' ? 0 : ''}
                bottom={0}
                mr="25px"
                position="absolute"
                bg="adminModal.button.bg"
                color="adminModal.button.color"
                fontSize="smm"
                fontWeight="bold"

                _hover={{ bg: "adminModal.button.hover" }}
                onClick={() => onAction(modalType)}
              >
                {modalType === "edit" ? "Update" : "Add"}
                <ChevronRight ml="5px" />
              </Button>

            </Box>
          </ModalBody>
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

export const adminModalStyles = {
  adminModal: {
    content: {
      bg: "#FFFFFF",
    },
    body: {
      bg: "#FFFFFF",
    },
    closeIcon: "#282F36",
    button: {
      bg: "#462AC4",
      hover: "#462AC4",
      keep: {
        bg: "#A2171E",
        hover: "#462AC4",
      },
      remove: {
        bg: "#E93C44",
        color: "#ffffff",

      },
      color: "#ffffff",

    },
    text: {
      color: "#ffffff",
    },
    delete: {
      bg: 'rgba(67, 76, 81, 0.95)',
    },
  }
}

