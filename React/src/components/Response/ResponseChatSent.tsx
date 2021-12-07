import { Avatar } from "@chakra-ui/avatar"
import { Button } from "@chakra-ui/button"
import { DeleteIcon } from "@chakra-ui/icons"
import { Text, Box } from "@chakra-ui/layout"
import { useState } from "react"
import moment from "moment";
import { IComment } from "../../interfaces/IComment"
import { Tooltip } from "@chakra-ui/tooltip"
import Icon from "@chakra-ui/icon"
import { Flex } from "@chakra-ui/react"


interface IResponseChat {
  isLast?: boolean;
  onAction: (id: string) => void;
  tooltip?: string
}

const ResponseChatSent = ({ _id, author, text, onAction, metatags, isLast, tooltip = '' }: IComment & IResponseChat) => {
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);

  const dateFormat = () => {
    const date = moment(metatags?.addedAt, 'YYYY-MM-DDThh:mm')
    const currentDate = moment()
    if (currentDate.diff(date, 'hours') <= 24) {
      return date.format('hh:mm')
    } else if (currentDate.diff(date, 'hours') > 24 && currentDate.diff(date, 'hours') <= 48) {
      return date.fromNow()
    }
    return date.format('hh:mm ddd/mm/yyyy')
  };

  return (
    <Box
      w="full"
      mb={3}
      flexDirection={'row'}
      display={'flex'}
    >
      <Avatar
        rounded='full'
        name={author?.displayName}
        size='xs'
        src={author?.imgUrl}
        mr={3}
      />
      <Box
        bg="responseChatSent.bg"
        px="12px"
        py="8px"
        w="full"
        borderRadius="10px"
        wordBreak="break-all"
        onMouseEnter={() => setShowDeleteBtn(true)}
        onMouseLeave={() => setShowDeleteBtn(false)}
      >
        <Flex justify='space-between' h={6}>
          <Text fontSize="ssm" fontWeight="semi_medium" color="responseChatSent.dateColor" mb="10px">{dateFormat()}</Text>
          {showDeleteBtn &&
            (
              <Button
                rightIcon={<DeleteIcon />}
                color="responseChatSent.delete.color"
                bg="responseChatSent.delete.bg"
                _hover={{ bg: "responseChatSent.delete.bg" }}
                onClick={() => onAction(_id)}
                size='xs'
                mb={2}
                mr='-4px'
              >Delete</Button>
            )
          }
        </Flex>
        {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
        <Text fontSize="smm" fontWeight="semi_medium" color="responseChatSent.color">{text}</Text>
      </Box>
    </Box>
  )
}

export default ResponseChatSent

export const responseChatSentStyles = {
  responseChatSent: {
    bg: "#1E1E38",
    color: "#FFFFFF",
    dateColor: "#818197",
    delete: {
      bg: "red",
      color: "#ffffff"
    }
  }
}