import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SkeletonCircle,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { toastFailed } from '../bootstrap/config';
import { useAppContext } from '../contexts/AppProvider';
import { useAuditContext } from '../contexts/AuditProvider';
import { useChatContext } from '../contexts/ChatProvider';
import { useResponseContext } from '../contexts/ResponseProvider';
import useDevice from '../hooks/useDevice';
import { IComment } from '../interfaces/IComment';
import Can from './can';
import ChatSent from './ChatItem';
import Loader from './Loader';
import MessageInput from './Response/MessageInput';

const GET_COMMENTS = gql`
  query ($_id: String!) {
    comments(_id: $_id) {
      _id
      componentId
      text
      authorId
      metatags {
        addedAt
        addedBy
      }
    }
  }
`;
const CREATE_COMMENT = gql`
  mutation ($values: CommentInput!) {
    createComment(commentInput: $values) {
      _id
      componentId
      text
    }
  }
`;
const DELETE_COMMENT = gql`
  mutation ($_id: String!) {
    deleteComment(_id: $_id)
  }
`;

const defaultValues = {
  text: '',
};

const Chat = ({ component }: { component: 'audit' | 'response' }) => {
  const toast = useToast();
  const device = useDevice();
  const { module } = useAppContext();
  const { audit } = useAuditContext()
  const { response } = useResponseContext()
  const { handleCloseMessage, chatParticipants, participantsLoading } = useChatContext();

  const { data, loading, refetch } = useQuery(GET_COMMENTS, {
    variables: { _id: component === 'audit' ? audit._id : response?._id },
    skip: component === 'audit' ? !audit : !response,
  });

  const [createFunction] = useMutation(CREATE_COMMENT);
  const [deleteFunction] = useMutation(DELETE_COMMENT);
  const [comments, setComments] = useState<IComment[]>([]);
  const divRef: any = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const scrollToBottom = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight;
  };

  useEffect(
    () => () => {
      if (device === 'tablet' || device === 'mobile') handleCloseMessage();
    },
    [],
  );

  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    if (data?.comments) setComments([...data.comments]);
    else setComments([]);
  }, [data]);

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues,
  });

  const addComment = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    try {
      if (Object.keys(errors).length === 0) {
        const text = getValues();
        const values = {
          ...text,
          componentId: component === 'audit' ? audit?._id : response?._id,
          scope: {
            moduleId: module?._id,
            type: module?.type,
          },
        };
        await createFunction({ variables: { values } });
        reset(defaultValues);
        refetch();
      }
    } catch (error) {
      toast({
        ...toastFailed,
        title: 'Comment not added',
        description: 'There was an issue while adding a comment. Try again later.',
      });
    }
  };

  const deleteComment = async (_id: string) => {
    try {
      await deleteFunction({ variables: { _id } });
      refetch();
    } catch (error) {
      toast({
        ...toastFailed,
        title: 'Comment not deleted',
        description: 'There was an issue while deleting a comment. Try again later.',
      });
    }
  };

  const getRole = (userId: string) => {
    if (!response) return '';

    if (response.responsibleId === userId) return 'Responsible';

    if (response.accountableId === userId) return 'Accountable';

    if (response.contributorsIds && response.contributorsIds?.length > 0 && response.contributorsIds.includes(userId)) return 'Contributor';

    return 'Follower';
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>List of all participants</ModalHeader>
          <ModalCloseButton />
          <ModalBody pr={2}>
            <Flex flexDirection="column" maxH="80vh" overflowY="auto" pr={4}>
              {chatParticipants?.map((user) => (
                <Flex align="center" justify="space-between" key={user._id} px="1" py="2">
                  <Flex align="center">
                    <Avatar
                      h="32px"
                      mr={chatParticipants.length > 1 ? '10px' : ''}
                      name={user?.displayName}
                      p="2px"
                      rounded="full"
                      src={user?.imgUrl}
                      w="32px"
                    />
                    <Text fontSize="14px">{user.displayName}</Text>
                  </Flex>
                  <Text fontSize="14px" fontWeight="700">
                    {getRole(user._id)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Stack h="full" pl="25px" pr={['25px', '25px', '0px']} spacing={2} w={['calc(100vw - 36px)', '300px', '330px']}>
        <Flex alignItems="center" flexDirection="column">
          <Text color="chat.text" fontSize="11px" fontWeight="400" lineHeight="16px" my="10px">
            Chat
          </Text>
          {participantsLoading ? (
            <SkeletonCircle mb={2} size="32px" />
          ) : (
            <Flex justify="center" mb={2} w="full">
              {chatParticipants.slice(0, 3).map((user, i) => (
                <Avatar
                  h="32px"
                  key={i}
                  mr={chatParticipants.length > 1 ? '10px' : ''}
                  name={user?.displayName}
                  p="2px"
                  rounded="full"
                  src={user?.imgUrl}
                  w="32px"
                />
              ))}
              {chatParticipants.length > 3 && (
                <Flex
                  align="center"
                  bg="chat.image.bg"
                  color="chat.image.color"
                  cursor="pointer"
                  fontSize="11px"
                  fontWeight="bold"
                  justify="center"
                  onClick={onOpen}
                  rounded="full"
                  w="32px"
                >
                  +{chatParticipants.length - 3}
                </Flex>
              )}
              {chatParticipants.length === 0 && (
                <Flex fontSize="13px" fontStyle="italic" mb="4">
                  No participants
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
        <Flex align="space-between" flexDirection="column" grow={1} overflow="hidden" pr="10px" w="calc(100% + 10px)">
          <Flex
            flexDirection="column"
            h={[
              "calc(100vh - 460px)",
              "calc(100vh - 406px )",
              `${component === 'audit' ? 'calc(100vh - 340px)' : 'calc(100vh - 360px)'}`]}
            overflow="auto"
            pr="10px"
            ref={divRef}
            sx={{
              '&::-webkit-scrollbar': {
                backgroundColor: 'chat.scrollBar.bg',
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'chat.scrollBar.color',
              },
            }}
            w="calc(100% + 10px)"
          >
            {loading && <Loader center size="md" />}
            {comments.map((comment) => (
              <ChatSent comment={comment} key={comment._id} onAction={deleteComment} />
            ))}
          </Flex>
          <Can
            action={component === 'audit' ? 'auditComments.add' : "comments.add"}
            data={{ ...(component === 'audit' ? { audit } : { response }) }}
            no={() => <Box h="20px" />}
            yes={() => (
              <MessageInput
                control={control}
                name="text"
                onAction={addComment}
                placeholder="Send message"
                validations={{
                  notEmpty: true,
                }}
              />
            )}
          />
        </Flex>
      </Stack>
    </>
  );
};

export default Chat;

export const chatStyles = {
  chat: {
    text: '#282F3680',
    scrollBar: {
      bg: '#E5E5E5',
      color: '#DDD',
    },
    image: {
      bg: '#818197',
      color: '#ffffff',
    },
  },
  mentionListItem: {
    color: '#818197',
    hoverColor: '#282F36',
  },
};
