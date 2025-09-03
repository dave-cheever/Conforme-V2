import { Box } from '@chakra-ui/react';

import Chat from './Chat';

function ChatMobileAndTablet({ component }: { component: 'audit' | 'response' }) {
  return (
    <Box
      data-id="030925-06dd5c"
      bg="white"
      boxShadow="lg"
      position="fixed"
      right="18px"
      rounded="20px"
      top={['175px']}
      zIndex="9">
      <Chat data-id="030925-9708cd" component={component} />
    </Box>
  );
}

export default ChatMobileAndTablet;
