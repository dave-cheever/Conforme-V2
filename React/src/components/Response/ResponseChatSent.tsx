import { useState } from "react";
import {
  Flex,
  Avatar,
  Button,
  Text,
  Box,
  Icon,
  Tooltip,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import moment from "moment";
import reactStringReplace from "react-string-replace";

import { IComment } from "../../interfaces/IComment";
import ChatMention from "./ChatMention";
import { useAppContext } from "../../contexts/AppProvider";

interface IResponseChat {
  isLast?: boolean;
  onAction: (id: string) => void;
  tooltip?: string;
}

const ResponseChatSent = ({
  _id,
  text,
  onAction,
  metatags,
  tooltip = "",
}: IComment & IResponseChat) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { user } = useAppContext();

  const dateFormat = () => {
    const date = moment(metatags?.addedAt, "YYYY-MM-DDThh:mm");
    const currentDate = moment();
    if (currentDate.diff(date, "hours") <= 24) {
      return date.format("hh:mm");
    } else if (
      currentDate.diff(date, "hours") > 24 &&
      currentDate.diff(date, "hours") <= 48
    ) {
      return date.fromNow();
    }
    return date.format("hh:mm ddd/mm/yyyy");
  };

  return (
    <Box w="full" mb={3} flexDirection={"row"} display={"flex"}>
      <Avatar
        rounded="full"
        name={user?.displayName}
        size="xs"
        src={user?.imgUrl}
        mr={3}
        loading="lazy"
      />
      <Box
        bg="responseChatSent.bg"
        px="12px"
        py="8px"
        w="full"
        borderRadius="10px"
        wordBreak="break-all"
        onMouseEnter={() => setShowDeleteBtn(true)}
        onMouseLeave={() => setShowDeleteBtn(false)}
        color="white"
      >
        <Flex justify="space-between" h={6}>
          <Text
            fontSize="ssm"
            fontWeight="semi_medium"
            color="responseChatSent.dateColor"
            mb="10px"
          >
            {dateFormat()}
          </Text>
          {showDeleteBtn && (
            <Button
              rightIcon={<DeleteIcon />}
              color="responseChatSent.delete.color"
              bg="responseChatSent.delete.bg"
              _hover={{ bg: "responseChatSent.delete.bg" }}
              onClick={() => onAction(_id)}
              size="xs"
              mb={2}
              mr="-4px"
            >
              Delete
            </Button>
          )}
        </Flex>
        {tooltip && (
          <Tooltip hasArrow label={tooltip} placement="top">
            <Icon name="info" mb={1} h="14px" />
          </Tooltip>
        )}
        {reactStringReplace(text, /(@@@\([\w]+\)\[[\w-]+\])/g, (match, i) => (
          <ChatMention key={i} tag={match} />
        ))}
      </Box>
    </Box>
  );
};

export default ResponseChatSent;

export const responseChatSentStyles = {
  responseChatSent: {
    bg: "#1E1E38",
    color: "#FFFFFF",
    dateColor: "#818197",
    mentionColor: "#FF9A00",
    delete: {
      bg: "red",
      color: "#ffffff",
    },
  },
};
