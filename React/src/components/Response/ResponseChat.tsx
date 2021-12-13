import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Text } from "@chakra-ui/layout"
import { useForm } from "react-hook-form";
import { gql, useMutation, useQuery } from "@apollo/client";
import MessageInput from "./MessageInput";
import ResponseChatRecieved from "./ResponseChatRecieved";
import ResponseChatSent from "./ResponseChatSent";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../contexts/AppProvider";
import { useResponseContext } from "../../contexts/ResponseProvider";
import Loader from "../Loader";
import { IComment } from "../../interfaces/IComment";
import { useToast } from "@chakra-ui/react";
import { toastFailed } from "../../bootstrap/config";

const GET_COMMENTS = gql`
  query ($_id: String!) {
    comments (_id: $_id) {
      _id
      responseId
      text
      author{
        _id
        firstName
        lastName
        displayName
        email
        jobTitle
        imgUrl
        defaultPage
        role
      }
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
  const { response } = useResponseContext();
  const { data, loading, refetch } = useQuery(GET_COMMENTS, { variables: { _id: response?._id } });
  const [createFunction] = useMutation(CREATE_COMMENT);
  const [deleteFunction] = useMutation(DELETE_COMMENT);
  const [comments, setComments] = useState<IComment[]>([]);
  const { user } = useAppContext();
  const divRef: any = useRef()

  const scrollToBottom = () => {
    divRef.current.scrollTop = divRef.current.scrollHeight
  }
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
  }, [data]);
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
          author: {
            _id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            displayName: user?.displayName,
            email: user?.email,
            jobTitle: user?.jobTitle,
            imgUrl: user?.imgUrl,
            defaultPage: user?.defaultPage,
            role: user?.role
          },
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

  const users = [response?.businessUnit];
  return (
    <Box w="330px" h="full" pl="25px" display={["none","none","block"]}>
      <Flex alignItems="center" flexDirection="column">
        <Text color="responseChat.text" fontSize="ssm" my={2}>Chat</Text>
        <Flex mb={2}>
          {users.slice(0, 3).map((user, i) => {
            return (
              <Avatar
                key={i}
                rounded='full'
                borderWidth={0}
                size="sm"
                src={user?.imgUrl}
                name={user?.name}
                mr={users.length > 1 ? "10px" : ""}
              />
            )
          })}
          {users.length > 3 && (
            <Box
              bg="responseChat.image.bg"
              color="responseChat.image.color"
              fontSize="smm"
              fontWeight="bold"
              px="8px"
              py="6px"
              rounded="full">
              {users.length - 3}
            </Box>
          )}
        </Flex>
      </Flex>
      <Flex
        h="calc(100vh - 280px)"
        overflow="hidden"
        flexDirection="column"
        w='calc(100% + 10px)'
        pr='10px'>
        <Flex
          h="full"
          overflowY={"auto"}
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
          >
            {loading && <Loader />}
            {comments.reverse().map((comment, i) =>
              user?._id === comment?.author?._id ?
                <ResponseChatSent key={comment._id} isLast={comments.length === i + 1} onAction={deleteComment} {...comment} /> :
                <ResponseChatRecieved {...comment} key={comment._id} />
            )}
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
    text: '#282F36',
    scrollBar: {
      bg: "#E5E5E5",
      color: "#DDD",
    },
    image: {
      bg: "#818197",
      color: "#ffffff"
    }
  }
}