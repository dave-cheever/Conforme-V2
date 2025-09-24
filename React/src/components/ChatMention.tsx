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
      if (userId) {
        const userName = getUpdatedDisplayName(userId);
        setUserName(userName || 'Unknown User');
      }
    } catch (e) {
      console.error('Error processing mention tag:', e);
    }
  }, [getUpdatedDisplayName, tag]);

  if (!userId) return <Text data-id="000236">{displayTag}</Text>;

  return (
    <Tooltip
      data-id="000237"
      bg="chatMention.tooltip.bg"
      color="chatMention.tooltip.color"
      hasArrow
      label={userName}
      placement="top"
    >
      <Text data-id="000238" color="chatMention.mentionColor" cursor="pointer" display="inline">
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
