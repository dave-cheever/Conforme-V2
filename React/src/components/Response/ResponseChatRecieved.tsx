import { Avatar } from "@chakra-ui/avatar"
import Icon from "@chakra-ui/icon";
import { Flex, Text, Box } from "@chakra-ui/layout"
import { Tooltip } from "@chakra-ui/tooltip";
import moment from "moment";
import { IComment } from "../../interfaces/IComment";


const ResponseChatRecieved = ({ author, text, metatags, tooltip = '' }: IComment & { tooltip?: string }) => {
  const dateFormat = () => {
    const date = moment(metatags?.addedAt, 'YYYY-MM-DDThh:mm')
    const currentDate = moment()
    if (currentDate.diff(date, 'hours') <= 24) {
      return date.fromNow()
    }
    return date.format('hh:mm ddd/mm/yyyy')
  }
  return (
    <Flex
      flexDirection="row-reverse"
      mb={3}
      w="full"
      wordBreak="break-all"
    >
      <Avatar
        rounded='full'
        name={author?.displayName}
        size='xs'
        src={author?.imgUrl}
        ml={3}
      />
      <Box bg="ResponseChatRecieved.bg" px="12px" borderRadius="10px" py="8px" w="full">
        <Text fontSize="ssm" fontWeight="semi_medium" color="ResponseChatRecieved.dateColor" mb="10px">{dateFormat()}</Text>
        {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
        <Text fontSize="smm" fontWeight="semi_medium">{text}</Text>
      </Box>
    </Flex>
  )
}

export default ResponseChatRecieved

export const responseChatRecievedStyles = {
  ResponseChatRecieved: {
    bg: "#FFFFFF",
    dateColor: "#818197",
  }
}
