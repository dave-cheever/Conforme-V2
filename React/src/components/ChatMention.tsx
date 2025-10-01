import React from 'react';

import { Text } from '@chakra-ui/react';

function ChatMention({ tag }) {
  // Simply extract the display name from the mention format and show it with @
  const displayName = tag.split('@[')[1]?.split('](')[0];

  return (
    <Text color="chatMention.mentionColor" cursor="pointer" data-id="000238" display="inline">
      @{displayName}
    </Text>
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
