import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Flex,
  HStack,
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
import format from 'date-fns/format';

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

function Chat({ component }: { component: 'audit' | 'response' }) {
  const toast = useToast();
  const device = useDevice();
  const { module } = useAppContext();
  const { audit } = useAuditContext();
  const { response } = useResponseContext();
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
      <Modal data-id="030925-766870" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay data-id="030925-9a2b8d" />
        <ModalContent data-id="030925-ef0c9c">
          <ModalHeader data-id="030925-56b88d">List of all participants</ModalHeader>
          <ModalCloseButton data-id="030925-2be2f6" />
          <ModalBody data-id="030925-ff7234" pr={2}>
            <Flex data-id="030925-b3a857" flexDirection="column" maxH="80vh" overflowY="auto" pr={4}>
              {chatParticipants?.map((user) => (
                <Flex align="center" data-id="030925-658378" justify="space-between" key={user._id} px="1" py="2">
                  <Flex align="center" data-id="030925-937496">
                    <Avatar
                      data-id="030925-73e894"
                      h="32px"
                      mr={chatParticipants.length > 1 ? '10px' : ''}
                      name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                      p="2px"
                      rounded="full"
                      src={user?.imgUrl}
                      w="32px"
                    />
                    <Text data-id="030925-df40af" fontSize="14px">
                      {user.displayName}
                    </Text>
                  </Flex>
                  <Text data-id="030925-7869c3" fontSize="14px" fontWeight="700">
                    {getRole(user._id)}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Stack
        bg={['chat.bg', 'chat.bg', 'transparent']}
        border="1px solid #CBD5E0"
        borderRadius="6px"
        boxShadow={['lg', 'lg', 'none']}
        data-id="030925-8871a5"
        h="auto"
        maxW={['calc(100vw - 36px)', '300px']}
        minW={['calc(100vw - 36px)', '300px']}
        overflow="hidden"
        position="fixed"
        right="25px"
        spacing={2}
      >
        <Flex alignItems="center" bg="white" borderBottom="1px solid #CBD5E0" data-id="030925-1e3fc6" px={4} py={3}>
        <Text
          color="#282F36"
          data-id="030925-3093e8"
          flex={1}
          fontSize="14px"
          fontWeight="bold"
          noOfLines={1}>
         {response?.trackerItem?.name &&  `"${response?.trackerItem?.name}"`} Chat
          </Text>
          <HStack data-id="030925-4fa714" mr={2} spacing={-2}>
            {participantsLoading ? (
              <SkeletonCircle data-id="030925-5c0751" size="8" />
            ) : (
              chatParticipants
                .slice(0, 3)
                .map((user, i) => (
                  <Avatar
                    border="2px solid white"
                    data-id="030925-a2b16d"
                    key={i}
                    name={user?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                    size="xs"
                    src={user?.imgUrl}
                    zIndex={3 - i} />
                ))
            )}
          </HStack>
          {!participantsLoading && chatParticipants.length > 3 && (
            <Flex
              align="center"
              bg="#F5F6FA"
              border="2px solid white"
              color="#6B7280"
              data-id="030925-9fc8d9"
              fontSize="sm"
              fontWeight="600"
              h="28px"
              justify="center"
              ml={1}
              onClick={onOpen}
              rounded="full"
              w="28px">
              +{chatParticipants.length - 3}
            </Flex>
          )}
        </Flex>
        <Flex
          align="space-between"
          data-id="030925-67891f"
          flexDirection="column"
          grow={1}
          overflow="hidden"
          pr="10px"
          w="calc(100% + 10px)"
        >
          <Flex
            data-id="030925-ea0068"
            flexDirection="column"
            h={['calc(100vh - 460px)', 'calc(100vh - 406px )', `${component === 'audit' ? 'calc(100vh - 340px)' : 'calc(100vh - 358px)'}`]}
            overflow="auto"
            p="20px"
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
            {loading && <Loader center data-id="030925-6d24c3" size="md" />}
              {comments.map((comment, idx) => {
                let currentTime = '';
                let prevTime = '';

                const currentAddedAt = comment.metatags?.addedAt;
                if (typeof currentAddedAt === 'string') 
                  currentTime = format(new Date(currentAddedAt), 'h:mm a');

                const prevAddedAt = comments[idx - 1]?.metatags?.addedAt;
                if (typeof prevAddedAt === 'string') 
                  prevTime = format(new Date(prevAddedAt), 'h:mm a');

                const showTime = currentTime !== prevTime;

                return (
                  <React.Fragment key={comment._id}>
                    {showTime && (
                      <Flex align="center" data-id="030925-047144" justify="center" my={4}>
                        <Text
                          bg="white"
                          color="rgb(0,0,0,0.5)"
                          data-id="030925-654f3d"
                          fontSize="sm"
                          fontWeight="500"
                          px={3}
                          py={1}>
                          {currentTime}
                        </Text>
                      </Flex>
                    )}
                    <ChatSent comment={comment} data-id="030925-6a45a5" onAction={deleteComment} />
                  </React.Fragment>
                );
              })}
          </Flex>
          <Can
            action={component === 'audit' ? 'auditComments.add' : 'comments.add'}
            data-id="030925-7057dc"
            yes={() => (
              <MessageInput
                data-id="030925-6eab4b"
                control={control}
                name="text"
                onAction={addComment}
                placeholder="Send message"
                validations={{
                  notEmpty: true,
                }}
              />
            )}
            // eslint-disable-next-line react/no-unstable-nested-components
            data={{ ...(component === 'audit' ? { audit } : { response }) }}
            // eslint-disable-next-line react/no-unstable-nested-components
            no={() => <Box data-id="030925-e74d82" h="20px" />}
          />
        </Flex>
      </Stack>
    </>
  );
}

export default Chat;

export const chatStyles = {
  chat: {
    bg: '#ffffff',
    text: '#282F3680',
    scrollBar: {
      bg: '#f5f5f5',
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
