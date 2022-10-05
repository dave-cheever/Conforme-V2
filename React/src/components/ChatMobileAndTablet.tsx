import { Box } from '@chakra-ui/react';

import Chat from './Chat';

const ChatMobileAndTablet = ({ component }: { component: 'audit' | 'response' }) => (
  <Box bg="white" boxShadow="lg" position="fixed" right="18px" rounded="20px" top={['175px']} zIndex="9">
    <Chat component={component} />
  </Box>
);

export default ChatMobileAndTablet;
