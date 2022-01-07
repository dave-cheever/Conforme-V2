import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Flex, SkeletonCircle, Text, useToast } from '@chakra-ui/react';
import { useForm } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";

import MessageInput from "./MessageInput";
import ResponseChatSent from "./ResponseChatItem";
import { useResponseContext } from "../../contexts/ResponseProvider";
import { IComment } from "../../interfaces/IComment";
import { toastFailed } from "../../bootstrap/config";
import Loader from "../Loader";
import useDevice from '../../hooks/useDevice';

const GET_COMMENTS = gql`
  query ($_id: String!) {
    comments (_id: $_id) {
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
  const device = useDevice()
  const { response, handleCloseMessage, users, participantsLoading } = useResponseContext();
  const { data, loading, refetch } = useQuery(GET_COMMENTS, { variables: { _id: response?._id } });
  const [createFunction] = useMutation(CREATE_COMMENT);
  const [deleteFunction] = useMutation(DELETE_COMMENT);
  const [comments, setComments] = useState<IComment[]>([]);
  const divRef: any = useRef()

  const scrollToBottom = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight
  }

  useEffect(() => {
    return () => {
      if (device === 'tablet' || device === 'mobile') {
        handleCloseMessage()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollToBottom()
  })

  useEffect(() => {
    if (data?.comments) {
      setComments(
        [...data.comments]
      );

    } else {
      setComments([]);
    }
  }, [data])

  const {
    control,
    formState: { errors },
    getValues,
    trigger,
    reset,
  } = useForm({
    mode: "all",
    defaultValues,
  });

  const addComment = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) {
      return;
    }

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
        title: "Comment not added",
        description: "There was an issue while adding a comment. Try again later.",
      });
    }
  }

  const deleteComment = async (_id: string) => {
    try {
      await deleteFunction({ variables: { _id } });
      refetch();
    } catch (error) {
      toast({
        ...toastFailed,
        title: "Comment not deleted",
        description: "There was an issue while deleting a comment. Try again later.",
      });
    }
  }

  return (
    <Box w={["calc(100vw - 30px)", "300px", "330px"]} h="full" pl="25px" pr={["25px", "25px", "0px"]}>
      <Flex alignItems="center" flexDirection="column">
        <Text color="responseChat.text" fontSize="11px" fontWeight="400" lineHeight="16px" my="10px">Chat</Text>
        {participantsLoading ? <SkeletonCircle size="32px" mb={2} /> :
          <Flex mb={2} w="full" justify="center">
            {users.slice(0, 3).map((user, i) => {
              return (
                <Avatar
                  key={i}
                  rounded='full'
                  borderWidth={0}
                  h="32px"
                  w="32px"
                  src={user?.imgUrl}
                  name={user?.displayName}
                  mr={users.length > 1 ? "10px" : ""}
                />
              )
            })}
            {users.length > 3 && (
              <Flex
                bg="responseChat.image.bg"
                color="responseChat.image.color"
                fontSize="smm"
                fontWeight="bold"
                w="32px"
                rounded="full"
                align="center"
                justify="center"
              >
                +{users.length - 3}
              </Flex>
            )}
            {users.length === 0 && (
              <Flex fontStyle="italic" fontSize="13px" mb="4">No participants</Flex>
            )}
          </Flex>}
      </Flex>
      <Flex
        h={["calc(100vh - 390px)", "calc(100vh - 340px)", "calc(100vh - 280px)"]}
        overflow="hidden"
        flexDirection="column"
        w='calc(100% + 10px)'
        pr='10px'>
        <Flex
          h="full"
          overflow="auto"
          flexDirection="column"
          ref={divRef}
          sx={{
            '&::-webkit-scrollbar': {
              backgroundColor: 'responseChat.scrollBar.bg',
              width: '4px'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'responseChat.scrollBar.color',
            },
          }}
          pr='10px'
          w='calc(100% + 10px)'
        >
          <Flex
            flex='1'
            alignItems="flex-end"
            justifyContent="flex-end"
            flexDirection='column'
            alignSelf="flex-end"
            bottom="0"
            w='full'
            h="full"
          >
            {loading && <Loader size="md" center={true} />}
            {comments.map((comment) => <ResponseChatSent key={comment._id}  onAction={deleteComment} comment={comment}/>)}
          </Flex>
        </Flex>
        <MessageInput
          name="text"
          placeholder="Send message"
          control={control}
          onAction={addComment}
          validations={{
            notEmpty: true,
          }}
        />
      </Flex>
    </Box>
  )
}


export default ResponseChat

export const responseChatStyles = {
  responseChat: {
    text: '#282F3680',
    scrollBar: {
      bg: "#E5E5E5",
      color: "#DDD",
    },
    image: {
      bg: "#818197",
      color: "#ffffff"
    }
  },
  mentionListItem: {
    color: "#818197",
    hoverColor: "#282F36"
  }
}