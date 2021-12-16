import { useEffect, useMemo } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Avatar, Icon, Flex, Text, Box , Tooltip} from "@chakra-ui/react";
import moment from "moment";
import reactStringReplace from "react-string-replace";

import { IComment } from "../../interfaces/IComment";
import ChatMention from "./ChatMention";

const GET_USERS_BY_ID = gql`
  query (
    $userQueryInput: UserQueryInput
  ) {
    author: usersById(userQueryInput: $userQueryInput) {
      displayName
      imgUrl
    }
  }
`;

const ResponseChatRecieved = ({ authorId, text, metatags, tooltip = '' }: IComment & { tooltip?: string }) => {

  const [getParticipantDetailById, {data}] = useLazyQuery(GET_USERS_BY_ID);
  const dateFormat = () => {
    const date = moment(metatags?.addedAt, 'YYYY-MM-DDThh:mm')
    const currentDate = moment()
    if (currentDate.diff(date, 'hours') <= 24) {
      return date.fromNow()
    }
    return date.format('hh:mm ddd/mm/yyyy')
  }

  const chatAuthor = useMemo(() => {
    return data?.author[0];
  },[data]);

  useEffect(() => {
    if(authorId){
      getParticipantDetailById({ variables: { userQueryInput: { userIds: [authorId] }}});
    }
  // eslint-disable-next-line
  },[authorId]); 

  return (
    <Flex
      flexDirection="row-reverse"
      mb={3}
      w="full"
      wordBreak="break-all"
    >
      <Avatar
        rounded='full'
        name={chatAuthor?.displayName}
        size='xs'
        src={chatAuthor?.imgUrl}
        ml={3}
      />
      <Box bg="responseChatRecieved.bg" px="12px" color="responseChatRecieved.textColor" borderRadius="10px" py="8px" w="full">
        <Text fontSize="ssm" fontWeight="semi_medium" color="responseChatRecieved.dateColor" mb="10px">{dateFormat()}</Text>
        {tooltip && <Tooltip hasArrow label={tooltip} placement="top"><Icon name="info" mb={1} h="14px" /></Tooltip>}
        {reactStringReplace(text, /(@@@\([\w]+\)\[[\w-]+\])/g, (match, i) => (
          <ChatMention key={i} tag={match} />
        ))}
      </Box>
    </Flex>
  )
}

export default ResponseChatRecieved

export const responseChatRecievedStyles = {
  responseChatRecieved: {
    bg: "#FFFFFF",
    dateColor: "#818197",
    textColor: "#282F36"
  }
}
