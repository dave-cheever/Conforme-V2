import { Box } from "@chakra-ui/layout"
import ResponseChat from "./ResponseChat"

const ResponseChatMobileAndTablet = () => {
  return (
    <Box
      bg="white"
      position="fixed"
      rounded="20px"
      boxShadow="lg"
      zIndex="1"
      right="18px"
      top={["175px"]}
      >
      <ResponseChat />
    </Box>
  )
}

export default ResponseChatMobileAndTablet