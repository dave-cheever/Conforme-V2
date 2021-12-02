import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Avatar } from "@chakra-ui/avatar";
import { CloseIcon } from "@chakra-ui/icons";
import { 
  Button,
  Flex, 
  Modal, 
  ModalBody, 
  ModalCloseButton, 
  ModalContent, 
  ModalFooter, 
  ModalHeader, 
  Text, 
  useDisclosure, 
} from "@chakra-ui/react";

import { useResponseContext } from "../../contexts/ResponseProvider";
import { IUser } from "../../interfaces/IUser";

const REMOVE_DELEGATE = gql`
  mutation ($responseDelegateModifyInput: ResponseDelegateModifyInput!) {
    removeDelegate(responseDelegateModifyInput: $responseDelegateModifyInput)
  }
`;

const AvatarUser = ({ user, removable }: {user: IUser, removable?: boolean}) => {
  const { response, refetch: refetchResponse } = useResponseContext();
  const { firstName, lastName, imgUrl, _id } = user;
  const [removeDelegate] = useMutation(REMOVE_DELEGATE);
  const [showDelete, setShowDelete] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  return (
    <>
      <Modal variant="teamModal" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalContent>
          <ModalHeader>
            <Text>Remove delegate?</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Text color="avatarUser.modal.body">This action cannot be undone</Text>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button 
              w="95px" 
              h="38px" 
              bg="avatarUser.modal.button.remove.bg" 
              color="avatarUser.modal.button.remove.color"
              onClick={async () => {
                await removeDelegate({ variables: { responseDelegateModifyInput: { _id: response?._id, delegateId: _id } } });
                refetchResponse();
              }}
            >Remove</Button>
            <Button 
              w="75px" 
              h="38px" 
              bg="avatarUser.modal.button.keep.bg" 
              color="avatarUser.modal.button.keep.color" 
              _hover={{opacity: "0.9"}} 
              onClick={onClose}
            >
              Keep
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex mr="30px" flexDirection="column" alignItems="center">
        <Avatar
          w="64px"
          h="64px"
          name={`${firstName} ${lastName}`}
          src={imgUrl}
          cursor={removable ? "pointer" : "default"}
          onMouseOver={() => setShowDelete(true)}
        />
        {showDelete && removable && 
          <Flex 
            pos="absolute" 
            alignItems="center" 
            justifyContent="center" 
            cursor="pointer"
            onClick={async ()=> {
              if(removable) {
                onOpen();
                setShowDelete(false);
              }
            }}  
          >
            <Flex 
              w="64px" 
              h="64px" 
              bg="avatarUser.overlay" 
              opacity="0.85" 
              rounded="50%" 
              onMouseOut={() => setShowDelete(false)}
            />
            <CloseIcon w="20px" h="20px" color="avatarUser.closeIcon" pos="absolute" opacity="0.95" />
          </Flex>
        }
        <Text
          mt="10px"
          fontSize="11px"
          fontWeight="semi_medium"
        >{`${firstName} ${lastName}`}</Text>
      </Flex>
    </>
  );
};

export default AvatarUser;

export const avatarUserStyles = {
  avatarUser: {
    modal: {
      body: "#818197",
      button: {
        remove: {
          bg: "#F0F2F5",
          color: "#818197"
        },
        keep: {
          bg: "#462AC4",
          color: "#FFFFFF"
        }
      }
    },
    overlay: "red",
    closeIcon: "#FFFFFF"
  }
};
