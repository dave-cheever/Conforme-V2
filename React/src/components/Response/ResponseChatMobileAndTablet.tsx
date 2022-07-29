import { Box } from '@chakra-ui/react';

import ResponseChat from './ResponseChat';

const ResponseChatMobileAndTablet = () => (
  <Box bg="white" boxShadow="lg" position="fixed" right="18px" rounded="20px" top={['175px']} zIndex="1">
    <ResponseChat />
  </Box>
);

export default ResponseChatMobileAndTablet;
