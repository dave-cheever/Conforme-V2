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

import { toastFailed } from '../../bootstrap/config';
import { useResponseContext } from '../../contexts/ResponseProvider';
import useDevice from '../../hooks/useDevice';
import { IComment } from '../../interfaces/IComment';
import Can from '../can';
import Loader from '../Loader';
import MessageInput from './MessageInput';
import ResponseChatSent from './ResponseChatItem';

const GET_COMMENTS = gql`
  query ($_id: String!) {
    comments(_id: $_id) {
      _id
      responseId
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
      responseId
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

const ResponseChat = () => {
  const toast = useToast();
  const device = useDevice();
  const { response, handleCloseMessage, users, participantsLoading } = useResponseContext();
  const { data, loading, refetch } = useQuery(GET_COMMENTS, {
    variables: { _id: response?._id },
    skip: !response,
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
          responseId: response?._id,
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
              {users?.map((user) => (
                <Flex align="center" justify="space-between" key={user._id} px="1" py="2">
                  <Flex align="center">
                    <Avatar
                      h="32px"
                      mr={users.length > 1 ? '10px' : ''}
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
      <Stack h="full" pl="25px" pr={['25px', '25px', '0px']} spacing={2} w={['calc(100vw - 30px)', '300px', '330px']}>
        <Flex alignItems="center" flexDirection="column">
          <Text color="responseChat.text" fontSize="11px" fontWeight="400" lineHeight="16px" my="10px">
            Chat
          </Text>
          {participantsLoading ? (
            <SkeletonCircle mb={2} size="32px" />
          ) : (
            <Flex justify="center" mb={2} w="full">
              {users.slice(0, 3).map((user, i) => (
                <Avatar
                  h="32px"
                  key={i}
                  mr={users.length > 1 ? '10px' : ''}
                  name={user?.displayName}
                  p="2px"
                  rounded="full"
                  src={user?.imgUrl}
                  w="32px"
                />
              ))}
              {users.length > 3 && (
                <Flex
                  align="center"
                  bg="responseChat.image.bg"
                  color="responseChat.image.color"
                  cursor="pointer"
                  fontSize="11px"
                  fontWeight="bold"
                  justify="center"
                  onClick={onOpen}
                  rounded="full"
                  w="32px"
                >
                  +{users.length - 3}
                </Flex>
              )}
              {users.length === 0 && (
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
            h="full"
            overflow="auto"
            pr="10px"
            ref={divRef}
            sx={{
              '&::-webkit-scrollbar': {
                backgroundColor: 'responseChat.scrollBar.bg',
                width: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'responseChat.scrollBar.color',
              },
            }}
            w="calc(100% + 10px)"
          >
            {loading && <Loader center size="md" />}
            {comments.map((comment) => (
              <ResponseChatSent comment={comment} key={comment._id} onAction={deleteComment} />
            ))}
          </Flex>
          <Can
            action="comments.add"
            data={{ response }}
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

export default ResponseChat;

export const responseChatStyles = {
  responseChat: {
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
