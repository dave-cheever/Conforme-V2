import React, { useEffect, useState } from "react";
import { Tooltip, Text } from "@chakra-ui/react";

import { useResponseContext } from "../../contexts/ResponseProvider";

const ChatMention = ({ tag }) => {
  const { getUpdatedDisplayName } = useResponseContext();
  const [displayTag, setDisplayTag] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    setDisplayTag(tag.split("@@@(")[1].split(")[")[0]);
    try {
      const userId = tag.split("@@@(")[1].split(")[")[1].slice(0, -1);
      setUserId(userId);
      const userName = getUpdatedDisplayName(userId);
      console.log('userName', userName);
      
      setUserName(userName);
    } catch (e) { }
  }, [getUpdatedDisplayName, tag]);

  if (!userId) {
    return <Text>{displayTag}</Text>;
  }
  return (
    <Tooltip
      hasArrow
      label={userName}
      placement="top"
      bg="chatMention.tooltip.bg"
      color="chatMention.tooltip.color"
    >
      <Text
        display="inline"
        cursor="pointer"
        color="responseChatSent.mentionColor"
      >
        {displayTag}
      </Text>
    </Tooltip>
  );
};

export const chatMentionStyles = {
  chatMention: {
    tooltip: {
      bg: 'white',
      color: 'black',
    },
  },
};

export default ChatMention;
