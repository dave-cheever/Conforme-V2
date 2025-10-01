import { Box } from '@chakra-ui/react';

import Chat from './Chat';

function ChatMobileAndTablet({ component }: { component: 'audit' | 'response' }) {
  return (
    <Box
      bg="white"
      boxShadow="lg"
      data-id="000284"
      position="fixed"
      right="18px"
      rounded="20px"
      top={['175px']}
      zIndex="9">
      <Chat component={component} data-id="000285" />
    </Box>
  );
}

export default ChatMobileAndTablet;
