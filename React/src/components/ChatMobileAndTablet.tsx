import { Box } from '@chakra-ui/react';

import Chat from './Chat';

const ChatMobileAndTablet = ({ component }: { component: 'audit' | 'response' }) => (
  <Box
    bg="white"
    boxShadow="lg"
    data-id="3527630b69f2"
    position="fixed"
    right="18px"
    rounded="20px"
    top={['175px']}
    zIndex="9">
    <Chat component={component} data-id="a2d95e92394b" />
  </Box>
);

export default ChatMobileAndTablet;
