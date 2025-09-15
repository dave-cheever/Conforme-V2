import React, { useEffect, useState } from 'react';

import { Text, Tooltip } from '@chakra-ui/react';

import { useResponseContext } from '../contexts/ResponseProvider';

function ChatMention({ tag }) {
  const { getUpdatedDisplayName } = useResponseContext();
  const [displayTag, setDisplayTag] = useState<string>();
  const [userId, setUserId] = useState<string>();
  const [userName, setUserName] = useState<string>();

  useEffect(() => {
    setDisplayTag(tag.split('@[')[1]?.split('](')[0]);
    try {
      const userId = tag.split('@[')[1]?.split('](')[1];
      setUserId(userId);
      const userName = getUpdatedDisplayName(userId);
      setUserName(userName);
    } catch (e) {}
  }, [getUpdatedDisplayName, tag]);

  if (!userId) return <Text data-id="030925-720112">{displayTag}</Text>;

  return (
    <Tooltip
        bg="chatMention.tooltip.bg"
        color="chatMention.tooltip.color"
        data-id="030925-d5c138"
        hasArrow
        label={userName}
        placement="top">
      <Text
        color="chatMention.mentionColor"
        cursor="pointer"
        data-id="030925-bccbd7"
        display="inline">
        {displayTag}
      </Text>
    </Tooltip>
  );
}

export const chatMentionStyles = {
  chatMention: {
    tooltip: {
      bg: 'white',
      color: 'black',
    },
    mentionColor: '#FF9A00',
  },
};

export default ChatMention;
