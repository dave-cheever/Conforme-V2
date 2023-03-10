import { useEffect, useMemo, useState } from 'react';
import reactStringReplace from 'react-string-replace';

import { gql, useLazyQuery } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Skeleton, Text, useDisclosure } from '@chakra-ui/react';
import differenceInDays from 'date-fns/differenceInDays';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import isToday from 'date-fns/isToday';

import { useAppContext } from '../contexts/AppProvider';
import useDevice from '../hooks/useDevice';
import { IComment } from '../interfaces/IComment';
import { chatMentionRegExp } from '../utils/regular-expressions';
import Can from './can';
import ChatMention from './ChatMention';
import ChatConfirmDeleteModal from './ConfirmDeleteModal';

interface IChatItem {
  comment: IComment;
  onAction: (id: string) => void;
}

const GET_USERS_BY_ID = gql`
  query ($userQueryInput: UserQueryInput) {
    author: usersById(userQueryInput: $userQueryInput) {
      displayName
      imgUrl
    }
  }
`;

const ChatItem = ({ onAction, comment }: IChatItem) => {
  const { metatags, authorId, _id, text } = comment;
  const [getParticipantDetailById, { data, loading }] = useLazyQuery(GET_USERS_BY_ID);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const device = useDevice();
  const { user } = useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dateFormat = () => {
    if (!metatags?.addedAt) return '';

    if (isToday(new Date(metatags?.addedAt))) return format(new Date(metatags?.addedAt), 'h:mm a');

    const days = differenceInDays(new Date(metatags?.addedAt), new Date());

    if (days <= 7) {
      return formatDistanceToNow(new Date(metatags?.addedAt), {
        addSuffix: true,
      });
    }

    return format(new Date(metatags?.addedAt), 'dd/MM/yyyy h:mm a');
  };

  const chatAuthor = useMemo(() => {
    if (authorId === user?._id) return user;

    return data?.author[0];
  }, [data, user, authorId]);

  useEffect(() => {
    if (authorId && authorId !== user?._id) {
      getParticipantDetailById({
        variables: { userQueryInput: { usersIds: [authorId] } },
      });
    }
  }, [authorId]);

  const isChatOwner = useMemo(() => user?._id === chatAuthor?._id, [user, chatAuthor]);

  return (<>
    <ChatConfirmDeleteModal
      data-id="dc472a4b9517"
      isOpen={isOpen}
      message={text}
      messageId={_id}
      onAction={onAction}
      onClose={onClose} />
    <Flex
      data-id="14e8c7b098e3"
      flexDirection={isChatOwner ? 'row' : 'row-reverse'}
      mb={3}
      w="full">
      <Box data-id="3dc91eeb3b25" ml={isChatOwner ? 0 : 3} mr={isChatOwner ? 3 : 0}>
        {loading ? (
          <Skeleton data-id="565e820cb9c8" h="24px" minW="24px" rounded="full" />
        ) : (
          <Avatar
            data-id="95819a8477ae"
            loading="lazy"
            name={chatAuthor?.displayName}
            p="2px"
            rounded="full"
            size="xs"
            src={chatAuthor?.imgUrl} />
        )}
      </Box>
      <Box
        bg={
          isChatOwner ? 'chatItem.sentBg' : device === 'mobile' || device === 'tablet' ? 'chatItem.receivedBgTM' : 'chatItem.receivedBg'
        }
        borderRadius="10px"
        color={isChatOwner ? 'chatItem.sentColor' : 'chatItem.receivedColor'}
        data-id="17b1f009ed87"
        onMouseEnter={() => setShowDeleteBtn(true)}
        onMouseLeave={() => setShowDeleteBtn(false)}
        px="12px"
        py="8px"
        w="full"
        wordBreak="break-word">
        <Flex data-id="88bcea1fba1f" h={6} justify="space-between">
          <Text
            color="chatItem.dateColor"
            data-id="bb5193a17997"
            fontSize="ssm"
            fontWeight="semi_medium"
            mb="10px">
            {dateFormat()}
          </Text>
          <Can
            action="comments.delete"
            data={{ comment }}
            data-id="37a0dc23ef23"
            yes={() => (
              <Button
                colorScheme="red"
                data-id="1eb4608d282d"
                display={showDeleteBtn ? 'block' : 'none'}
                mb={2}
                mr="-4px"
                onClick={() => onOpen()}
                rightIcon={<DeleteIcon data-id="b213fabd621a" />}
                size="xs">
                Delete
              </Button>
            )} />
        </Flex>
        {reactStringReplace(text, chatMentionRegExp, (match, i) => (
          <ChatMention data-id="1e14aba604d6" key={i} tag={match} />
        ))}
      </Box>
    </Flex>
  </>);
};

export default ChatItem;

export const chatItemStyles = {
  chatItem: {
    sentBg: '#1E1E38',
    receivedBg: '#FFFFFF',
    receivedBgTM: '#F0F0F0',
    sentColor: '#FFFFFF',
    receivedColor: '#282F36',
    dateColor: '#818197',
    mentionColor: '#FF9A00',
    delete: {
      bg: 'red',
      color: '#ffffff',
    },
  },
};
