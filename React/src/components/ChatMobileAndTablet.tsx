import { Box } from '@chakra-ui/react';

import Chat from './Chat';

function ChatMobileAndTablet({ component }: { component: 'audit' | 'response' }) {
  return (
    <Box
      bg="white"
      boxShadow="lg"
      data-id="030925-06dd5c"
      position="fixed"
      right="18px"
      rounded="20px"
      top={['175px']}
      zIndex="9">
      <Chat component={component} data-id="030925-9708cd" />
    </Box>
  );
}

export default ChatMobileAndTablet;
