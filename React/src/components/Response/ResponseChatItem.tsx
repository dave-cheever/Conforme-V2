import { useEffect, useMemo, useState } from "react";
import { Flex, Avatar, Button, Text, Box, Skeleton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import reactStringReplace from "react-string-replace";
import { gql, useLazyQuery } from "@apollo/client";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import format from "date-fns/format";
import isToday from "date-fns/isToday";

import { IComment } from "../../interfaces/IComment";
import ChatMention from "./ChatMention";
import { useAppContext } from "../../contexts/AppProvider";
import Can from "../can";
import useDevice from "../../hooks/useDevice"
import differenceInDays from "date-fns/differenceInDays";


interface IResponseChat {
  comment: IComment;
  onAction: (id: string) => void;
}

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    author: usersById(userQueryInput: $userQueryInput) {
      displayName
      imgUrl
    }
  }
`;

const ResponseChatItem = ({ onAction, comment }: IResponseChat) => {
  const { metatags, authorId, _id, text } = comment;
  const [getParticipantDetailById, { data, loading }] =
    useLazyQuery(GET_USERS_BY_ID);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const device = useDevice()
  const { user } = useAppContext();

  const dateFormat = () => {
    if(!metatags?.addedAt){
      return "";
    }

    if(isToday(new Date(metatags?.addedAt))){
      return format(new Date(metatags?.addedAt), "h:mm a");
    }
    
    const days = differenceInDays(new Date(metatags?.addedAt), new Date());

    if(days <= 7){
      return formatDistanceToNow(new Date(metatags?.addedAt), { addSuffix: true });
    }

    return format(new Date(metatags?.addedAt), "dd/MM/yyyy h:mm a");
  };

  const chatAuthor = useMemo(() => {
    if (authorId === user?._id) {
      return user;
    }

    return data?.author[0];
  }, [data, user, authorId]);

  useEffect(() => {
    if (authorId && authorId !== user?._id) {
      getParticipantDetailById({
        variables: { userQueryInput: { usersIds: [authorId] } },
      });
    }
    // eslint-disable-next-line
  }, [authorId]);

  const isChatOwner = useMemo(() => {
    return user?._id === chatAuthor?._id;
  }, [user, chatAuthor]);

  return (
    <Flex w="full" mb={3} flexDirection={isChatOwner ? "row" : "row-reverse"}>
      <Box mr={isChatOwner ? 3 : 0} ml={isChatOwner ? 0 : 3}>
        {loading ? (
          <Skeleton minW="24px" h="24px" rounded="full" />
        ) : (
          <Avatar
            rounded="full"
            name={chatAuthor?.displayName}
            size="xs"
            src={chatAuthor?.imgUrl}
            loading="lazy"
          />
        )}
      </Box>
      <Box
        bg={
          isChatOwner
            ? "responseChatItem.sentBg"
            : (device === "mobile" || device === "tablet") ? "responseChatItem.receivedBgTM" : "responseChatItem.receivedBg"
        }
      px="12px"
      py="8px"
      w="full"
      borderRadius="10px"
      onMouseEnter={() => setShowDeleteBtn(true)}
      onMouseLeave={() => setShowDeleteBtn(false)}
      color={
        isChatOwner
          ? "responseChatItem.sentColor"
          : "responseChatItem.receivedColor"
      }
      >
      <Flex justify="space-between" h={6}>
        <Text
          fontSize="ssm"
          fontWeight="semi_medium"
          color="responseChatItem.dateColor"
          mb="10px"
        >
          {dateFormat()}
        </Text>
        <Can
          action="comments.delete"
          data={{ comment }}
          yes={() => (
            <Button
              display={showDeleteBtn ? "block" : "none"}
              rightIcon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => onAction(_id)}
              size="xs"
              mb={2}
              mr="-4px"
            >
              Delete
            </Button>
          )}
        />
      </Flex>
      {reactStringReplace(text, /(@@@\([\w]+\)\[[\w-]+\])/g, (match, i) => (
        <ChatMention key={i} tag={match} />
      ))}
    </Box>
    </Flex >
  );
};

export default ResponseChatItem;

export const responseChatItemStyles = {
  responseChatItem: {
    sentBg: "#1E1E38",
    receivedBg: "#FFFFFF",
    receivedBgTM: "#F0F0F0",
    sentColor: "#FFFFFF",
    receivedColor: "#282F36",
    dateColor: "#818197",
    mentionColor: "#FF9A00",
    delete: {
      bg: "red",
      color: "#ffffff",
    },
  },
};
