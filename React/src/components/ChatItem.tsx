import { useEffect, useMemo, useState } from 'react';
import reactStringReplace from 'react-string-replace';

import { gql, useLazyQuery } from '@apollo/client';
import { DeleteIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Flex, Skeleton, SkeletonCircle, Text, useDisclosure } from '@chakra-ui/react';

import { useAppContext } from '../contexts/AppProvider';
import { IComment } from '../interfaces/IComment';
import { chatMentionRegExp } from '../utils/regular-expressions';
import Can from './can';
import ChatMention from './ChatMention';
import ChatConfirmDeleteModal from './ConfirmDeleteModal';

interface IChatItem {
  comment: IComment;
  onAction: (id: string) => void;
}

const GET_USERS_BY_ID_FROM_DB = gql`
  query ($userQueryInput: UserQueryInput) {
    author: usersByIdFromDb(userQueryInput: $userQueryInput) {
      displayName
      imgUrl
    }
  }
`;

function ChatItem({ onAction, comment }: IChatItem) {
  const { authorId, _id, text } = comment;
  const [getParticipantDetailById, { data, loading }] = useLazyQuery(GET_USERS_BY_ID_FROM_DB);
  const [showDeleteBtn, setShowDeleteBtn] = useState(false);
  const { user } = useAppContext();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const chatAuthor = useMemo(() => {
    if (authorId === user?.userId) return user;
    return data?.author[0];
  }, [data, user, authorId]);

  useEffect(() => {
    if (authorId && authorId !== user?._id) {
      getParticipantDetailById({
        variables: { userQueryInput: { usersIds: [authorId] } },
      });
    }
  }, [authorId]);

  const isChatOwner = useMemo(() => user?.userId === chatAuthor?.userId, [user, chatAuthor]);

  return (
    <>
      <ChatConfirmDeleteModal data-id="030925-4d5ea5" isOpen={isOpen} message={text} messageId={_id} onAction={onAction} onClose={onClose} />
      <Flex align={isChatOwner ? 'flex-end' : 'flex-start'} data-id="030925-8ddd04" flexDirection="column" mb={3} w="full">
        <Flex
          alignItems="end"
          data-id="030925-e615c1"
          flexDirection="row"
          justify={isChatOwner ? 'flex-end' : 'flex-start'}
          w="full">
          {!isChatOwner &&
            (loading ? (
              <SkeletonCircle data-id="030925-4ab6fa" mr={2} size="8" />
            ) : (
              <Avatar
                data-id="030925-19432d"
                loading="lazy"
                mr={2}
                name={chatAuthor?.displayName?.replace(/\s*\(.*?\)\s*/g, '')}
                p="2px"
                rounded="full"
                size="sm"
                src={chatAuthor?.imgUrl}
              />
            ))}
          <Flex
            alignItems={isChatOwner ? 'end' : 'baseline'}
            data-id="030925-6b9c7f"
            direction="column">
            {!isChatOwner &&
              (loading ? (
                <Skeleton data-id="030925-8b029f" height="14px" mb={1} width="80px" />
              ) : (
                <Text
                  color="#718096"
                  data-id="030925-ef0532"
                  fontSize="10px"
                  fontWeight="500"
                  mb={1}>
                  {chatAuthor?.displayName}
                </Text>
              ))}
            <Box
              bg={isChatOwner ? '#462AC4' : '#EDF2F7'}
              borderRadius={isChatOwner ? '8px 8px 2px 8px' : '8px 8px 8px 4px'}
              boxShadow={isChatOwner ? '0 2px 8px #462AC420' : 'none'}
              color={isChatOwner ? '#FFFFFF' : '#2D3748'}
              data-id="030925-0a2791"
              maxW="75%"
              minW="120px"
              onMouseEnter={() => setShowDeleteBtn(true)}
              onMouseLeave={() => setShowDeleteBtn(false)}
              position="relative"
              px={5}
              py={3}
            >
              <Text data-id="030925-4d23ef" fontSize="sm" mb={1}>
                {reactStringReplace(text, chatMentionRegExp, (match, i) => (
                  <ChatMention data-id="030925-944b45" key={i} tag={match} />
                ))}
              </Text>
              <Flex
                align="center"
                data-id="030925-82f6a8"
                justify={isChatOwner ? 'flex-end' : 'flex-start'}>
                <Can
                  action="comments.delete"
                  data={{ comment }}
                  data-id="030925-c4bcec"
                  yes={() => (
                    <Button
                      colorScheme="red"
                      data-id="030925-0d786d"
                      display={showDeleteBtn ? 'block' : 'none'}
                      mb={2}
                      ml={2}
                      onClick={() => onOpen()}
                      rightIcon={<DeleteIcon data-id="030925-f07c11" />}
                      size="xs"
                    >
                      Delete
                    </Button>
                  )}
                />
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default ChatItem;

export const chatItemStyles = {
  chatItem: {
    sentBg: '#462AC4',
    receivedBg: '#EDF2F7',
    receivedBgTM: '#F0F0F0',
    sentColor: '#FFFFFF',
    receivedColor: '#2D3748',
    dateColor: '#818197',
    mentionColor: '#FF9A00',
    delete: {
      bg: 'red',
      color: '#ffffff',
    },
  },
};
