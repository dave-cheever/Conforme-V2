import { useState } from 'react';

import { gql, useMutation } from '@apollo/client';
import { CloseIcon } from '@chakra-ui/icons';
import {
  Avatar,
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
  useToast,
} from '@chakra-ui/react';

import { toastFailed } from '../../bootstrap/config';
import { useResponseContext } from '../../contexts/ResponseProvider';
import { useTeamContext } from '../../contexts/TeamProvider';
import { ReplaceIcon } from '../../icons';
import { IUser } from '../../interfaces/IUser';
import Can from '../can';

const REMOVE_PARTICIPANT = gql`
  mutation ($responseParticipantRemove: ResponseParticipantRemove!) {
    removeParticipant(responseParticipantRemove: $responseParticipantRemove)
  }
`;

const AvatarUser = ({
  user,
  permission,
  isRemovable = true,
  action,
  isReplaceable,
}: {
  user: IUser;
  permission: string;
  isRemovable?: boolean;
  action: string;
  isReplaceable?: boolean;
}) => {
  const { response, snapshot, refetch: refetchResponse } = useResponseContext();
  const { onOpen: onReplace, setFilterType, setIsReplaceAccountable } = useTeamContext();
  const { displayName, imgUrl, _id } = user;
  const [showDelete, setShowDelete] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const OpenReplaceOrDeleteModal = () => {
    if (isReplaceable) {
      onReplace();
      setFilterType(`${permission}Id`);
      setIsReplaceAccountable(true);
    } else onOpen();
  };
  const [removeParticipant] = useMutation(REMOVE_PARTICIPANT);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose} variant="teamModal">
        <ModalContent>
          <ModalHeader>
            <Text>Remove {permission}?</Text>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Text color="avatarUser.modal.body">This action cannot be undone</Text>
          </ModalBody>
          <ModalFooter justifyContent="space-between">
            <Button
              bg="avatarUser.modal.button.remove.bg"
              color="avatarUser.modal.button.remove.color"
              h="38px"
              onClick={async () => {
                try {
                  await removeParticipant({
                    variables: {
                      responseParticipantRemove: {
                        _id: response?._id,
                        participantId: _id,
                        permission,
                      },
                    },
                  });
                  refetchResponse();
                  onClose();
                } catch (error: any) {
                  toast({
                    ...toastFailed,
                    title: 'Error',
                    description: error.message,
                  });
                }
              }}
              w="95px"
            >
              Remove
            </Button>
            <Button
              _hover={{ opacity: '0.9' }}
              bg="avatarUser.modal.button.keep.bg"
              color="avatarUser.modal.button.keep.color"
              h="38px"
              onClick={onClose}
              w="75px"
            >
              Keep
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex align="center" flexDirection="column" mr="30px" position="relative" textAlign="center" w="60px">
        <Avatar
          cursor="default"
          h={['55px', '64px']}
          name={displayName}
          onMouseOver={() => !snapshot && setShowDelete(true)}
          src={imgUrl}
          w={['55px', '64px']}
        />
        <Can
          action={action}
          data={{ response }}
          yes={() =>
            showDelete && isRemovable ? (
              <Flex
                alignItems="center"
                cursor="pointer"
                justifyContent="center"
                onClick={async () => {
                  if (isRemovable) {
                    OpenReplaceOrDeleteModal();
                    setShowDelete(false);
                  }
                }}
                pos="absolute"
              >
                <Flex bg="avatarUser.overlay" h="64px" onMouseOut={() => setShowDelete(false)} rounded="50%" w="64px" />
                {isReplaceable ? (
                  <ReplaceIcon
                    h="20px"
                    onMouseOver={() => setShowDelete(true)}
                    opacity="0.95"
                    pos="absolute"
                    stroke="avatarUser.icon"
                    w="20px"
                  />
                ) : (
                  <CloseIcon
                    color="avatarUser.icon"
                    h="20px"
                    onMouseOver={() => setShowDelete(true)}
                    opacity="0.95"
                    pos="absolute"
                    w="20px"
                  />
                )}
              </Flex>
            ) : (
              <></>
            )
          }
        />
        <Text fontSize="11px" fontWeight="semi_medium" mt="10px">
          {displayName}
        </Text>
      </Flex>
    </>
  );
};

export default AvatarUser;

export const avatarUserStyles = {
  avatarUser: {
    modal: {
      body: '#818197',
      button: {
        remove: {
          bg: '#F0F2F5',
          color: '#818197',
        },
        keep: {
          bg: '#462AC4',
          color: '#FFFFFF',
        },
      },
    },
    overlay: 'linear-gradient(0deg, rgba(232, 60, 67, 0.8), rgba(232, 60, 67, 0.8)), url(.png)',
    icon: '#FFFFFF',
  },
};
